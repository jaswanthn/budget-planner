import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./app/Layout";
import { useEffect, useState } from "react";
import { getSession } from "@/api/auth.api";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile"

import Home from "./pages/Home";
import Buckets from "./pages/Buckets";
import Transactions from "./pages/Transactions";
import Review from "./pages/Review";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    const checkSession = async () => {
       // Timeout after 5 seconds to prevent hanging
       const timeoutPromise = new Promise((resolve) => 
         setTimeout(() => resolve(null), 5000)
       );

       try {
         const s = await Promise.race([getSession(), timeoutPromise]);
         setSession(s);
       } catch (err) {
         console.error("Session check failed", err);
         setSession(null);
       } finally {
         setLoading(false);
       }
    };

    checkSession();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-foreground">Loading App...</div>;

  if (!session) {
    return <Auth />;
  }
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buckets" element={<Buckets />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/review" element={<Review />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
// Force rebuild Fri Dec 26 19:29:42 IST 2025
