import type { Bucket } from "../types/budget";

export function getDaysInMonth(date = new Date()): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getDaysElapsed(date = new Date()): number {
  return date.getDate();
}

export function calculateSafeToSpend(
  totalRemaining: number,
  remainingDays: number
): number {
  if (remainingDays <= 0) return 0;
  return Math.floor(totalRemaining / remainingDays);
}

export function projectBucketSpend(
  bucket: Bucket,
  elapsedDays: number,
  totalDays: number
) {
  const burnRate =
    elapsedDays > 0 ? bucket.spent / elapsedDays : 0;

  const projected = burnRate * totalDays;
  const overshoot =
    projected > bucket.limit
      ? Math.round(projected - bucket.limit)
      : 0;

  return {
    burnRate,
    projected,
    overshoot
  };
}