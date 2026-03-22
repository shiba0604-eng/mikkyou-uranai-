import { prisma } from "@/lib/db";

const DEFAULT_EXPORT_COST = 1;

export function exportCreditCost(_slideCount: number): number {
  return DEFAULT_EXPORT_COST;
}

export async function getCreditsByEmail(email: string): Promise<number> {
  const row = await prisma.slideCreditAccount.findUnique({
    where: { email },
    select: { creditsBalance: true },
  });
  return row?.creditsBalance ?? 0;
}

export async function consumeExportCredit(
  email: string,
  slideCount: number,
  dnaId: string,
): Promise<{ ok: boolean; balance: number }> {
  const cost = exportCreditCost(slideCount);
  const account = await prisma.slideCreditAccount.findUnique({
    where: { email },
  });
  if (!account || account.creditsBalance < cost) {
    return { ok: false, balance: account?.creditsBalance ?? 0 };
  }
  await prisma.$transaction([
    prisma.slideCreditAccount.update({
      where: { id: account.id },
      data: { creditsBalance: { decrement: cost } },
    }),
    prisma.slideExportLog.create({
      data: {
        accountId: account.id,
        slideCount,
        dnaId,
        consumed: cost,
      },
    }),
  ]);
  const updated = await prisma.slideCreditAccount.findUnique({
    where: { id: account.id },
  });
  return { ok: true, balance: updated?.creditsBalance ?? 0 };
}

export async function ensureAccountWithCredits(
  email: string,
  initialCredits: number,
): Promise<void> {
  await prisma.slideCreditAccount.upsert({
    where: { email },
    create: { email, creditsBalance: initialCredits, creditsLifetime: initialCredits },
    update: {},
  });
}
