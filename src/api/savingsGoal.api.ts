import { supabase } from "@/lib/supabase";

/**
 * Fetch the latest active savings goal
 */
export async function fetchLatestSavingsGoal() {
  try {
    const { data, error } = await supabase
      .from("savings_goals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.warn("Savings goal fetch failed:", error.message);
      return null;
    }

    // Return the first item if array has data, otherwise null
    return data && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.warn("Error fetching savings goal:", err);
    return null;
  }
}

/**
 * Save a new monthly savings goal entry
 */
export async function saveSavingsGoal(monthlySavingsGoal: number) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const { error } = await supabase.from("savings_goals").insert({
      user_id: user.id,
      monthly_goal: monthlySavingsGoal,
    });

    if (error) {
      console.error("Failed to save savings goal:", error.message);
      throw error;
    }
  } catch (err) {
    console.error("Error saving savings goal:", err);
    throw err;
  }
}
