import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bucket } from "@/types/budget";

interface Props {
  bucket: Bucket & {
    projected?: number;
    overshoot?: number;
  };
}

export default function BucketCard({ bucket }: Props) {
  const percent = Math.min(
    Math.round((bucket.spent / bucket.limit) * 100),
    100
  );

  const status =
    bucket.spent > bucket.limit
      ? "danger"
      : percent > 85
      ? "warning"
      : "ok";

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">{bucket.name}</h4>
          <span className="text-sm text-muted-foreground">
            ₹{bucket.spent.toLocaleString()} / ₹
            {bucket.limit.toLocaleString()}
          </span>
        </div>

        <Progress value={percent} />

        <div className="text-xs">
          {status === "ok" && (
            <span className="text-green-600">On track</span>
          )}
          {status === "warning" && (
            <span className="text-amber-600">
              Tight — slow down
            </span>
          )}
          {status === "danger" && (
            <span className="text-red-600">
              Overspent by ₹
              {(bucket.spent - bucket.limit).toLocaleString()}
            </span>
          )}
        </div>

        {bucket.overshoot && bucket.overshoot > 0 && (
          <div className="text-xs text-red-500">
            Projected overshoot: ₹
            {bucket.overshoot.toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
