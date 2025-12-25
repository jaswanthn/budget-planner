import { supabase } from "@/lib/supabase";

export async function fetchRecurringExpenses() {
  const { data, error } = await supabase
    .from("recurring_expenses")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch recurring expenses", error);
    throw error;
  }

  return data;
}

export async function addRecurringExpense(input: {
  name: string;
  amount: number;
}) {
  const { error } = await supabase
    .from("recurring_expenses")
    .insert({
      name: input.name,
      amount: input.amount,
      frequency: "monthly"
    });

  if (error) {
    console.error("Failed to add recurring expense", error);
    throw error;
  }
}

export async function disableRecurringExpense(id: string) {
  const { error } = await supabase
    .from("recurring_expenses")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    console.error("Failed to disable recurring expense", error);
    throw error;
  }
}
