import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
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

const generateAPILogo = async (
  logoName: string,
): Promise<string | undefined> => {
  if (env.MOCK_DALLE_API === "true") {
    return b64Image;
  } else {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: logoName,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    return response.data[0]?.b64_json;
  }
};

export const generateRouter = createTRPCRouter({
  generateLogo: protectedProcedure
    .input(
      z.object({
        logoName: z.string(),
        tagLine: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      if (result.credits <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough credits",
        });
      }

      const base64EncodedImage = await generateAPILogo(input.logoName);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const logo = await ctx.db.logos.create({
        data: {
          logoName: input.logoName,
          userId: ctx.session.user.id,
        },
      });

      const BUCKET_NAME = "generator-logo";

      // Save the generated logo to the database
      await s3
        .putObject({
          Bucket: BUCKET_NAME,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          Key: `${logo.id}.png`,
          Body: Buffer.from(base64EncodedImage!, "base64"),
          ContentEncoding: "base64",
          ContentType: "image/png",
        })
        .promise();

      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${logo.id}.png`,
      };
    }),
});
