import { Transaction } from "@/types/budget";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: Props) {
  if (!transactions.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No transactions yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <Card key={tx.id} className="border border-border bg-card shadow-sm">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">
                {tx.note || "Expense"}
              </p>
              <p className="text-xs text-muted-foreground">
                {tx.bucket} •{" "}
                {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>

            <div className="font-semibold">
              ₹{tx.amount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
