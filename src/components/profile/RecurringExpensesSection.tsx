import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBudgetStore } from "@/data/useBudgetStore";

export default function RecurringExpensesSection() {
  const { data, addFixedExpense, removeFixedExpense } =
    useBudgetStore();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!name || !amount) return;

    setSaving(true);
    try {
      await addFixedExpense({
        name,
        amount: Number(amount)
      });
      setName("");
      setAmount("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
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
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Fixed Expenses
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6 pt-6 flex flex-col">
        {/* Add new */}
        <div className="grid gap-3 p-4 rounded-xl bg-muted/20 border border-border/40">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Add New Expense</h4>
          <div className="grid grid-cols-1 gap-3">
             <Input
               placeholder="Expense name (e.g. Rent)"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="bg-background"
             />
             <div className="flex gap-3">
               <div className="relative flex-1">
                 <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                 <Input
                   type="number"
                   placeholder="Amount"
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   className="pl-7 bg-background"
                 />
               </div>
               <Button onClick={handleAdd} disabled={saving}>
                 {saving ? "Adding..." : "Add"}
               </Button>
             </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Expenses</h4>
            {(data.recurringExpenses ?? []).length > 0 ? (
              <ul className="space-y-2">
                {data.recurringExpenses.map((e: any) => (
                  <li
                    key={e.id}
                    className="group flex justify-between items-center bg-card border border-border/50 rounded-lg p-3 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                         <span className="text-xs font-bold">{e.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{e.name}</p>
                        <p className="text-xs text-muted-foreground">Monthly</p>
                      </div>
                    </div>
    
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">₹{e.amount.toLocaleString()}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFixedExpense(e.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border/40 rounded-xl">
                 <p className="text-sm">No fixed expenses added yet.</p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
