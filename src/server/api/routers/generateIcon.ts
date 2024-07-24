import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
import { env } from "@/env";
import { b64Image } from "@/data/b64Image";
import AWS from "aws-sdk";

const openai = new OpenAI({
  apiKey: env.DALLE_API_KEY,
});

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});

const generateAPIIcon = async (prompt: string, numberOfIcons: number) => {
  if (env.MOCK_DALLE_API === "true") {
    return new Array<string>(numberOfIcons).fill(b64Image);
    // const response = await openai.images.generate({
    //   model: "dall-e-2",
    //   prompt: promptExample,
    //   n: numberOfIcons,
    //   size: "1024x1024",
    //   response_format: "b64_json",
    // });
    // return response.data.map((result) => result.b64_json ?? "");
  } else {
    const results = [];
    for (let i = 0; i < numberOfIcons; i++) {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });
      results.push(response.data[0]?.b64_json);
    }
    return results;
  }
};

export const generateIconRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        color: z.string(),
        background: z.string(),
        fontStyle: z.string(),
        numberOfIcons: z.number().min(1).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (result!.credits <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not enough credits",
        });
      } else {
        await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            credits: {
              decrement: input.numberOfIcons,
            },
          },
        });
      }

      const prompt = `Create an Icon with size 128x128px visually striking ${input.fontStyle} of a majestic ${input.prompt}, blending elements of natural beauty with ${input.fontStyle} aesthetics. Utilize high - resolution textures and materials to bring out the ${input.fontStyle} elements. Experiment with vibrant colour, such as ${input.color}, to enhance the ${input.fontStyle} vibe with a ${input.background} background. `;

      const base64EncodedImages = await generateAPIIcon(
        prompt,
        input.numberOfIcons,
      );

      const BUCKET_NAME = "generator-logo";

      const createIcon = await Promise.all(
        base64EncodedImages.map(async (image) => {
          const icon = await ctx.db.icons.create({
            data: {
              prompt: input.prompt,
              userId: ctx.session.user.id,
            },
          });

          await s3
            .putObject({
              Bucket: BUCKET_NAME,
              Key: `${icon.id}.png`,
              Body: Buffer.from(image ?? "", "base64"),
              ContentEncoding: "base64",
              ContentType: "image/png",
            })
            .promise();

          return icon;
        }),
      );

      return createIcon.map((icon) => {
        return {
          imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${icon.id}.png`,
        };
      });
    }),
});
