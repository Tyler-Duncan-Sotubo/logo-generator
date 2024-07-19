import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { env } from "@/env";

import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get("Stripe-Signature");
  if (!sig) {
    console.log("No signature");
    return NextResponse.json({ error: "No signature" });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
    typescript: true,
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    console.log(`Webhook signature verification failed.`, message);
    return NextResponse.json({ error: err });
  }

  console.log("received ", event.type);

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const completedEvent = event.data.object as {
        id: string;
        metadata: {
          userId: string;
        } | null;
      };
      await db.user.update({
        where: {
          id: completedEvent.metadata?.userId,
        },
        data: {
          credits: {
            increment: 100,
          },
        },
      });

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
