import { useBudgetStore } from "@/data/useBudgetStore";
import { useBudgetEngine } from "@/engine/useBudgetEngine";

import SafeToSpendCard from "@/components/SafeToSpendCard";
import MonthStatusCard from "@/components/MonthStatusCard";
import SpendingTrendChart from "@/components/dashboard/SpendingTrendChart";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";

export default function Home() {
  const { data } = useBudgetStore();
  const budget = useBudgetEngine(data);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Main Insight */}
        <div className="lg:col-span-2 space-y-6">
          <SafeToSpendCard
            amount={budget.safeToSpendToday}
            remaining={budget.totalRemaining}
            daysLeft={budget.remainingDays}
          />
          <SpendingTrendChart />
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <MonthStatusCard status={budget.monthStatus as "on_track" | "tight" | "critical"} />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}
