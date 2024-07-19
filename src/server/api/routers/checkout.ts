import { z } from "zod";
import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import stripe from "stripe";

const Stripe = new stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    return await Stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        userId: ctx.session.user.id,
      },
      line_items: [
        {
          price: env.PRODUCT_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.HOST_NAME}`,
      cancel_url: `${env.HOST_NAME}`,
    });
  }),
});
