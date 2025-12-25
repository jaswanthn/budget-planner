import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileSummary() {
  return (
    <Card className="bg-muted/30 border-none shadow-inner">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Budget Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your "Safe to Spend" is calculated based on your Income minus Fixed Expenses, distributed over the remaining days of the month.
        </p>
      </CardContent>
    </Card>
  );
}
