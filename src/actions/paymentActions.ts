"use server";

type Interval = "DAY" | "WEEK" | "MONTH" | "YEAR";

export async function createPaymentSession(
  payAmount: number,
  subsInterval: Interval
): Promise<string> {
  const url = `${process.env.BACKEND_URL}/api/subscription/checkout?amount=${payAmount}&interval=${subsInterval.toLocaleLowerCase()}`;
  return url;
}
