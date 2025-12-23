import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./app/Layout";
import { useEffect, useState } from "react";
import { getSession } from "@/api/auth.api";
import Auth from "@/pages/Auth";

import Home from "./pages/Home";
import Buckets from "./pages/Buckets";
import Transactions from "./pages/Transactions";
import Review from "./pages/Review";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
