import { z } from "zod";
import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import stripe from "stripe";

const Stripe = new stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    .input(
      z.object({
        price: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let price = "";
      if (input.price === "5") {
        price = env.PRODUCT_PRICE_ID;
      } else if (input.price === "9") {
        price = env.PRODUCT_PRICE_ID_100;
      } else if (input.price === "25") {
        price = env.PRODUCT_PRICE_ID_300;
      }

      return await Stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        metadata: {
          userId: ctx.session.user.id,
        },
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.HOST_NAME}`,
        cancel_url: `${env.HOST_NAME}`,
      });
    }),
});
