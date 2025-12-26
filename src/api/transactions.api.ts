import { supabase } from "@/lib/supabase";

export async function createTransaction(input: {
  bucketId: string;
  amount: number;
  note?: string;
  occurredAt: string;
}) {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      bucket_id: input.bucketId,
      amount: input.amount,
      note: input.note,
      occurred_at: input.occurredAt,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTransaction(id: string | number) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}
