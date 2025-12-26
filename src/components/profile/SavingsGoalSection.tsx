import { useState } from "react";
import { useBudgetStore } from "@/data/useBudgetStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function SavingsGoalSection() {
  const { data, setSavingsGoal } = useBudgetStore();
  const [editing, setEditing] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const goal = Number(goalInput);
    if (goal >= 0) {
      setSaving(true);
      setError(null);
      console.log("Attempting to save savings goal:", goal);
      
      try {
        await setSavingsGoal(goal);
        console.log("Savings goal saved successfully!");
        setEditing(false);
        setGoalInput("");
      } catch (err: any) {
        console.error("Failed to save savings goal:", err);
        setError(err.message || "Failed to save goal. Please try again.");
      } finally {
        setSaving(false);
      }
    }
  };

  // Calculate actual savings
  const totalExpenses = data.buckets.reduce((sum, b) => sum + b.spent, 0);
  const fixedExpenses = data.recurringExpenses.reduce((sum, e) => sum + e.amount, 0);
  const actualSavings = data.income - totalExpenses - fixedExpenses;
  
  // Calculate progress percentage
  const progressPercentage = data.savingsGoal > 0 
    ? Math.min(Math.max((actualSavings / data.savingsGoal) * 100, 0), 100)
    : 0;

  const isOnTrack = actualSavings >= data.savingsGoal;

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Monthly Savings Goal
        </CardTitle>
        <CardDescription>
          Track your progress towards your savings target
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!editing ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Target</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{data.savingsGoal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Savings</span>
                <span className={`text-2xl font-bold ${isOnTrack ? 'text-green-600' : 'text-orange-600'}`}>
                  ₹{actualSavings.toLocaleString()}
                </span>
              </div>
            </div>

            {data.savingsGoal > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{progressPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-xs text-muted-foreground text-center">
                  {isOnTrack 
                    ? `🎉 Great job! You're ${actualSavings >= data.savingsGoal ? 'meeting' : 'on track to meet'} your goal!`
                    : `₹${(data.savingsGoal - actualSavings).toLocaleString()} more needed to reach your goal`
                  }
                </p>
              </div>
            )}

            <Button 
              onClick={() => {
                setEditing(true);
                setGoalInput(data.savingsGoal.toString());
              }} 
              variant="outline" 
              className="w-full"
            >
              {data.savingsGoal > 0 ? 'Update Goal' : 'Set Goal'}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Monthly Savings Goal
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">₹</span>
                <Input
                  type="number"
                  placeholder="0"
                  className="pl-8 text-lg font-semibold h-12"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                className="flex-1"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button 
                onClick={() => {
                  setEditing(false);
                  setGoalInput("");
                  setError(null);
                }} 
                variant="outline"
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
