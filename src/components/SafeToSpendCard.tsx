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
    <Card className="border-none shadow-lg overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Safe to spend today
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div className="text-5xl font-bold tracking-tight text-primary tabular-nums">
          ₹{amount.toLocaleString()}
        </div>

        <div className="flex items-center justify-between text-sm pt-4 border-t border-border/50">
          <div className="text-muted-foreground">
            <span className="font-semibold text-foreground">₹{remaining.toLocaleString()}</span> remaining total
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
            {daysLeft} days left
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
