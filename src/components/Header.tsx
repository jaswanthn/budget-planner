import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

export default function HeaderTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 p-4 backdrop-blur-xl bg-card/80 border-b border-border/40 transition-all duration-200 flex justify-center items-center relative">
      <Tabs
        value={location.pathname}
        onValueChange={(v) => navigate(v)}
        className="w-full max-w-4xl"
      >
        <TabsList className="w-full h-12 bg-muted/30 p-1.5 rounded-full border border-border/40 backdrop-blur-md shadow-inner gap-2">
          {["/", "/buckets", "/transactions", "/review", "/profile"].map((path) => (
            <TabsTrigger
              key={path}
              value={path}
              className="flex-1 rounded-full text-xs uppercase tracking-wider font-semibold 
                         data-[state=active]:!bg-[var(--primary)] data-[state=active]:!text-[var(--primary-foreground)] 
                         data-[state=active]:shadow-md data-[state=active]:shadow-primary/20
                         hover:bg-background/40 transition-all duration-300 ease-out"
            >
              {path === "/" ? "Today" : path.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <button 
        onClick={async () => {
          await import("@/api/auth.api").then(m => m.signOut());
          window.location.reload();
        }}
        className="absolute right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
        title="Logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
      </button>
    </header>
  );
}
