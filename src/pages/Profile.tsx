import IncomeSection from "@/components/profile/IncomeSection";
import RecurringExpensesSection from "@/components/profile/RecurringExpensesSection";
import ProfileSummary from "@/components/profile/ProfileSummary";
import SavingsGoalSection from "@/components/profile/SavingsGoalSection";

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 pb-6 border-b border-border/40">
        <div className="size-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-xl shadow-primary/20">
          U
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">Manage your income, expenses, and savings goals</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Income & Savings Goal */}
        <div className="space-y-6">
          <IncomeSection />
          <SavingsGoalSection />
        </div>

        {/* Fixed / Recurring expenses & Summary */}
        <div className="space-y-6">
          <RecurringExpensesSection />
          <ProfileSummary />
        </div>
      </div>
    </div>
  );
}
