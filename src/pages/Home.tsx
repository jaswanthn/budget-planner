import { useBudgetStore } from "@/data/useBudgetStore";
import { useBudgetEngine } from "@/engine/useBudgetEngine";

import SafeToSpendCard from "@/components/SafeToSpendCard";
import MonthStatusCard from "@/components/MonthStatusCard";

export default function Home() {
  const { data } = useBudgetStore();
  const budget = useBudgetEngine(data);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <SafeToSpendCard
        amount={budget.safeToSpendToday}
        remaining={budget.totalRemaining}
        daysLeft={budget.remainingDays}
      />
      <MonthStatusCard status={budget.monthStatus} />
    </div>
  );
}
