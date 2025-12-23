import { useBudgetStore } from "@/data/useBudgetStore";
import { useBudgetEngine } from "@/engine/useBudgetEngine";

import BucketCard from "@/components/BucketCard";

export default function Buckets() {
  const { data } = useBudgetStore();
  const budget = useBudgetEngine(data);

  return (
    <div className="space-y-4">
      {budget.bucketInsights.map((bucket) => (
        <BucketCard key={bucket.name} bucket={bucket} />
      ))}
    </div>
  );
}
