import {
  Card,
  CardContent
} from "@/components/ui/card";

interface Props {
  status: "on_track" | "tight" | "critical";
}

const STATUS_MAP = {
  on_track: {
    label: "On track",
    color: "text-green-600"
  },
  tight: {
    label: "Tight",
    color: "text-amber-600"
  },
  critical: {
    label: "Overshooting",
    color: "text-red-600"
  }
};

export default function MonthStatusCard({ status }: Props) {
  const s = STATUS_MAP[status];

  return (
    <Card className="border-none">
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">
          Month status
        </div>
        <div className={`text-lg font-medium ${s.color}`}>
          {s.label}
        </div>
      </CardContent>
    </Card>
  );
}
