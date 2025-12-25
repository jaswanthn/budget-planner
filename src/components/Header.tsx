import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

export default function HeaderTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 p-4 backdrop-blur-xl bg-card/80 border-b border-border/40 transition-all duration-200 flex justify-center">
      <Tabs
        value={location.pathname}
        onValueChange={(v) => navigate(v)}
        className="w-full max-w-xl"
      >
        <TabsList className="w-full grid grid-cols-5 h-12 bg-muted/50 p-1 shadow-sm">
          <TabsTrigger value="/" className="text-xs font-medium">Today</TabsTrigger>
          <TabsTrigger value="/buckets" className="text-xs font-medium">Buckets</TabsTrigger>
          <TabsTrigger value="/transactions" className="text-xs font-medium">Txns</TabsTrigger>
          <TabsTrigger value="/review" className="text-xs font-medium">Review</TabsTrigger>
          <TabsTrigger value="/profile" className="text-xs font-medium">Profile</TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}
