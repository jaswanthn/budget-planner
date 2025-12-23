import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

export default function HeaderTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Tabs
      value={location.pathname}
      onValueChange={(v) => navigate(v)}
    >
      <TabsList>
        <TabsTrigger value="/">Today</TabsTrigger>
        <TabsTrigger value="/buckets">Buckets</TabsTrigger>
        <TabsTrigger value="/transactions">Transactions</TabsTrigger>
        <TabsTrigger value="/review">Review</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
