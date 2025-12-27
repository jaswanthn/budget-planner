import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Safe to spend today
              </CardTitle>
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground/70 cursor-help hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Your "Safe to Spend" is calculated based on your Income minus Fixed Expenses, distributed over the remaining days of the month.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div>
           <div className="text-5xl font-bold tracking-tight text-primary tabular-nums">
             ₹{amount.toLocaleString()}
           </div>
           <p className="text-sm text-muted-foreground mt-2">
             You can spend this amount today without impacting your bills or savings goals.
           </p>
        </div>

        <div className="space-y-2 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Monthly Budget Remaining</span>
            <span className="font-semibold text-foreground">₹{remaining.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
             <div className="h-full bg-primary/70 rounded-full" style={{ width: `${Math.min(100, (remaining > 0 ? 100 : 0))}%` }} />
          </div>
          <div className="flex justify-end">
            <div className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              {daysLeft} days left in month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
