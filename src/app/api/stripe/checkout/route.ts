import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  successPath: z.string().optional(),
});

/**
 * Stripe Checkout セッション作成（クレジット購入）。
 * 環境変数: STRIPE_SECRET_KEY, STRIPE_PRICE_SLIDE_CREDITS, NEXT_PUBLIC_APP_URL
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_SLIDE_CREDITS;
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (req.headers.get("origin") ?? "http://localhost:3000");

  if (!stripe || !priceId) {
    return NextResponse.json(
      {
        error: "stripe_not_configured",
        hint: "Set STRIPE_SECRET_KEY and STRIPE_PRICE_SLIDE_CREDITS",
      },
      { status: 501 },
    );
  }

  try {
    const json = await req.json();
    const { email, successPath } = bodySchema.parse(json);
    const creditsPack = process.env.STRIPE_CREDITS_PER_PURCHASE ?? "10";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}${successPath ?? "/studio"}?checkout=success`,
      cancel_url: `${base}/lp?checkout=cancel`,
      metadata: { email, credits: creditsPack },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "checkout_failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
