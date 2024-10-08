import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/env";
import { api } from "@/trpc/react";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_KEY);

export function useBuyCredits({ price }: { price: string }) {
  const checkout = api.checkout.createCheckout.useMutation();

  return {
    buyCredits: async () => {
      const res = await checkout.mutateAsync({ price: price });
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: res.id,
      });
    },
  };
}
