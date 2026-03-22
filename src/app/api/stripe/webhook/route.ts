import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

async function fulfillCredits(session: Stripe.Checkout.Session) {
  const email = session.customer_email || session.metadata?.email;
  const creditsRaw = session.metadata?.credits ?? "10";
  const credits = Math.max(1, parseInt(creditsRaw, 10) || 10);
  if (!email) return;

  await prisma.slideCreditAccount.upsert({
    where: { email },
    create: {
      email,
      creditsBalance: credits,
      creditsLifetime: credits,
      stripeCustomerId:
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? null,
    },
    update: {
      creditsBalance: { increment: credits },
      creditsLifetime: { increment: credits },
      stripeCustomerId:
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? undefined,
    },
  });
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  if (!sig) {
    return NextResponse.json({ error: "no_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillCredits(session);
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "fulfillment_failed" }, { status: 500 });
  }
}
