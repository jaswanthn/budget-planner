import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudgetStore } from "@/data/useBudgetStore";
import { useMemo } from "react";
import { startOfMonth, eachDayOfInterval, format, isSameDay } from "date-fns";

export default function SpendingTrendChart() {
  const { data } = useBudgetStore();

  const chartData = useMemo(() => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = today; // Show trend up to today

    const days = eachDayOfInterval({ start, end });
    
    return days.reduce((acc, day) => {
      const dailySpend = data.transactions
        .filter((t) => isSameDay(new Date(t.date), day))
        .reduce((sum, t) => sum + t.amount, 0);

      const previousCumulative = acc.length > 0 ? acc[acc.length - 1].spend : 0;

      acc.push({
        date: format(day, "d MMM"),
        spend: previousCumulative + dailySpend,
        daily: dailySpend,
      });
      
      return acc;
    }, [] as { date: string; spend: number; daily: number }[]);
  }, [data.transactions]);

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Spending Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: "#9ca3af" }} 
              interval={4}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                borderRadius: "8px", 
                border: "none", 
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" 
              }}
              formatter={(value: number) => [`₹${value}`, "Total Spent"]}
            />
            <Area
              type="monotone"
              dataKey="spend"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSpend)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
