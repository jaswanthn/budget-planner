import { supabase } from "@/lib/supabase";

/**
 * Fetch the latest active income profile
 */
export async function fetchLatestIncome() {
  const { data, error } = await supabase
    .from("income_profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data ?? null;
}

/**
 * Save a new monthly income entry
 * (creates history, does NOT overwrite)
 */
export async function saveIncome(monthlyIncome: number) {
  const { error } = await supabase
    .from("income_profiles")
    .insert({
      monthly_income: monthlyIncome
    });

  if (error) {
    console.error("Failed to save income", error);
    throw error;
  }
}
