import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface SafeToSpendProps {
  amount: number;
  remaining: number;
  daysLeft: number;
}

export default function SafeToSpendCard({
  amount,
  remaining,
  daysLeft
}: SafeToSpendProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Safe to spend today
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-4xl font-semibold tracking-tight">
          ₹{amount.toLocaleString()}
        </div>

        <div className="text-sm text-muted-foreground">
          ₹{remaining.toLocaleString()} left · {daysLeft} days remaining
        </div>
      </CardContent>
    </Card>
  );
}
