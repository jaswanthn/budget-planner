import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBudgetStore } from "@/data/useBudgetStore";

export default function IncomeSection() {
  const { data, setIncome } = useBudgetStore();

  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data.income) {
      setValue(String(data.income));
    }
  }, [data.income]);

  async function handleSave() {
    if (!value) return;

    setSaving(true);
    try {
      await setIncome(Number(value));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Monthly Income
          </CardTitle>
          {data.income > 0 && (
            <div className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              Active
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
            <Input
              type="number"
              placeholder="e.g. 120000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pl-7"
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

        {data.income > 0 && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
             <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">Current Monthly Income</span>
                <span className="font-bold text-green-700 dark:text-green-400">₹{data.income.toLocaleString()}</span>
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
