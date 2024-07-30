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
  accessKeyId: env.BUCKET_ACCESS_KEY_ID,
  secretAccessKey: env.BUCKET_SECRET_ACCESS_KEY,
});

const generateAPILogo = async (prompt: string) => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json",
  });
  return response.data[0]?.b64_json;
};

export const generateRouter = createTRPCRouter({
  generateLogo: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        letterOne: z.string(),
        letterTwo: z.string(),
        industry: z.string(),
        colors: z.array(z.string()),
        fontStyle: z.string(),
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
          message: "no credit",
        });
      } else {
        await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            credits: {
              decrement: 1,
            },
          },
        });
      }

      const colors = input.colors.map((color) => color.toLowerCase());
      const prompt = `The Icon should not contain any text, the Icon should not contain any other images, one Icon only . Create a letterform Icon for '${input.prompt}'  emphasizing the '${input.letterOne}' and '${input.letterTwo}', representing the brand's expertise in providing cutting-edge ${input.industry} solutions, using a color palette of ${colors.join(" , ")}, using white or black background. The Icon should be ${input.fontStyle}, sleek, and professional.`;

      const base64EncodedImage = await generateAPILogo(prompt);

      const BUCKET_NAME = "generator-logo";

      const logo = await ctx.db.logos.create({
        data: {
          prompt: input.prompt,
          userId: ctx.session.user.id,
        },
      });

      await s3
        .putObject({
          Bucket: BUCKET_NAME,
          Key: `${logo.id}.png`,
          Body: Buffer.from(base64EncodedImage!, "base64"),
          ContentEncoding: "base64",
          ContentType: "image/png",
        })
        .promise();

      return {
        imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${logo.id}.png`,
      };
    }),
});
