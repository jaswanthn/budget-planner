import { useBudgetStore } from "@/data/useBudgetStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivityCard() {
  const { data } = useBudgetStore();
  
  const recent = data.transactions.slice(0, 5);

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent transactions.</p>
        ) : (
          recent.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="text-xs font-bold">
                       {tx.bucket[0]?.toUpperCase() || "E"}
                    </span>
                 </div>
                 <div>
                    <p className="text-sm font-medium leading-none">{tx.note || tx.bucket}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                       {formatDistanceToNow(new Date(tx.date), { addSuffix: true })}
                    </p>
                 </div>
              </div>
              <div className={`font-semibold text-sm ${tx.type === 'income' ? 'text-green-600' : ''}`}>
                 {tx.type === 'income' ? '+' : ''}₹{tx.amount.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
