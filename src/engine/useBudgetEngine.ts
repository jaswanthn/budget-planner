import type { BudgetData } from "../types/budget";
import {
  calculateSafeToSpend,
  getDaysElapsed,
  getDaysInMonth,
  projectBucketSpend
} from "./budgetEngine";

export function useBudgetEngine(data: BudgetData) {
  const today = new Date();

  const totalDays = getDaysInMonth(today);
  const elapsedDays = getDaysElapsed(today);
  const remainingDays = totalDays - elapsedDays;

  const totalAllocated = data.buckets.reduce(
    (sum, b) => sum + b.limit,
    0
  );

  const totalSpent = data.buckets.reduce(
    (sum, b) => sum + b.spent,
    0
  );

  const totalRemaining = totalAllocated - totalSpent;

  const safeToSpendToday = calculateSafeToSpend(
    totalRemaining,
    remainingDays
  );

  const bucketInsights = data.buckets.map((bucket) => ({
    ...bucket,
    ...projectBucketSpend(bucket, elapsedDays, totalDays)
  }));

  const overshootingBuckets = bucketInsights.filter(
    (b) => b.overshoot > 0
  );

  const monthStatus =
    overshootingBuckets.length === 0
      ? "on_track"
      : overshootingBuckets.length === 1
      ? "tight"
      : "critical";

  return {
    safeToSpendToday,
    totalRemaining,
    remainingDays,
    monthStatus,
    bucketInsights,
    overshootingBuckets
  };
}
