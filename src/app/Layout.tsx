import Header from "../components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground flex flex-col items-center">
      <div className="w-full max-w-[1400px] flex flex-col min-h-screen relative shadow-2xl shadow-black/5 bg-card border-x border-border/40">
        <Header />
        <main className="flex-1 p-6 lg:p-12 space-y-10 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
