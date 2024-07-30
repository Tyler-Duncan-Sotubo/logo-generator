import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { env } from "@/env";

import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get("Stripe-Signature");
  if (!sig) {
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

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const completedEvent = event.data.object as {
        id: string;
        amount_total: number;
        metadata: {
          userId: string;
        } | null;
      };

      let credits = 0;
      switch (completedEvent.amount_total) {
        case 499:
          credits = 50;
          break;
        case 899:
          credits = 100;
          break;
        case 199:
          credits = 20;
          break;
        default:
          console.log(`Unhandled amount ${completedEvent.amount_total}`);
      }

      await db.user.update({
        where: {
          id: completedEvent.metadata?.userId,
        },
        data: {
          credits: {
            increment: credits,
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
