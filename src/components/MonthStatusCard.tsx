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
    <Card className="border-none bg-muted/30 shadow-inner">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
           <div className="text-sm font-medium text-muted-foreground mb-1">
             Month Status
           </div>
           <div className={`text-lg font-bold tracking-tight ${s.color} flex items-center gap-2`}>
             {s.label}
           </div>
        </div>
        
        <div className={`size-10 rounded-full flex items-center justify-center ${s.color.replace('text-', 'bg-')}/10`}>
           {status === 'on_track' && (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={s.color}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
           )}
           {status === 'tight' && (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={s.color}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
           )}
           {status === 'critical' && (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={s.color}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
