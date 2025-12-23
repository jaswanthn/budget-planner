import { supabase } from "@/lib/supabase";

export async function fetchBuckets() {
  const { data, error } = await supabase
    .from("buckets")
    .select("id, name, monthly_limit")
    .order("created_at");

  if (error) throw error;
  return data;
}

export async function fetchTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("occurred_at", { ascending: false });

  if (error) throw error;
  return data;
}