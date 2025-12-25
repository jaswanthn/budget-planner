import { useEffect, useState } from "react";
import { BudgetData, Transaction } from "@/types/budget";
import { fetchBuckets, fetchTransactions } from "@/api/budget.api";
import { createTransaction } from "@/api/transactions.api";
import { supabase } from "@/lib/supabase";
import { fetchLatestIncome, saveIncome } from "@/api/income.api";
import {
  fetchRecurringExpenses,
  addRecurringExpense,
  disableRecurringExpense,
} from "@/api/recurringExpenses.api";

const STORAGE_KEY = "budget_planner_v1";

const DEFAULT_DATA: BudgetData = {
  income: 0,
  buckets: [],
  transactions: [],
  recurringExpenses: [],
};

export function useBudgetStore() {
  const [data, setData] = useState<BudgetData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_DATA;

    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        buckets: Array.isArray(parsed.buckets) ? parsed.buckets : [],
        transactions: Array.isArray(parsed.transactions)
          ? parsed.transactions
          : [],
      };
    } catch {
      return DEFAULT_DATA;
    }
  });

  /* ----------------------------------------
   * Persist locally (cache / offline)
   * --------------------------------------*/
  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // }, [data]);

  /* ----------------------------------------
   * Sync from Supabase (READ)
   * --------------------------------------*/
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) return;

      try {
        const [bucketRows, transactionRows, incomeRow, recurringExpenseRows] =
          await Promise.all([
            fetchBuckets(),
            fetchTransactions(),
            fetchLatestIncome(),
            fetchRecurringExpenses(),
          ]);

        setData((prev) => ({
          ...prev,
          buckets: bucketRows.map((b: any) => ({
            id: b.id,
            name: b.name,
            limit: b.monthly_limit,
            spent: transactionRows
              .filter((t: any) => t.bucket_id === b.id)
              .reduce((sum: number, t: any) => sum + t.amount, 0),
          })),
          transactions: transactionRows.map((t: any) => ({
            id: t.id,
            amount: t.amount,
            bucket:
              bucketRows.find((b: any) => b.id === t.bucket_id)?.name ??
              "Unknown",
            note: t.note ?? "",
            date: t.occurred_at,
          })),
          income: incomeRow?.monthly_income ?? prev.income,
          recurringExpenses: recurringExpenseRows.map((r: any) => ({
            id: r.id,
            name: r.name,
            amount: r.amount,
          })),
        }));
      } catch (e) {
        console.warn("Backend sync failed", e);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* ----------------------------------------
   * Write transaction (OPTIMISTIC + BACKEND)
   * --------------------------------------*/
  async function addTransaction(input: {
    amount: number;
    bucket: string;
    note?: string;
  }) {
    const bucketRecord = data.buckets.find((b) => b.name === input.bucket);

    if (!bucketRecord) {
      console.error("Bucket not found");
      return;
    }

    const optimisticTx: Transaction = {
      id: Date.now(),
      amount: input.amount,
      bucket: input.bucket,
      note: input.note ?? "",
      date: new Date().toISOString(),
      type: "expense",
      category: "shopping-bag", // Default icon
      tags: [],
    };

    // Optimistic UI update
    setData((prev) => ({
      ...prev,
      buckets: prev.buckets.map((b) =>
        b.name === input.bucket ? { ...b, spent: b.spent + input.amount } : b
      ),
      transactions: [optimisticTx, ...(prev.transactions ?? [])],
    }));

    try {
      await createTransaction({
        bucketId: bucketRecord.id,
        amount: input.amount,
        note: input.note,
        occurredAt: new Date().toISOString().slice(0, 10),
      });
    } catch (e) {
      console.error("Failed to persist transaction to Supabase", e);
      // NOTE: rollback can be added later
    }
  }

  async function setIncome(monthlyIncome: number) {
    await saveIncome(monthlyIncome);

    setData((prev) => ({
      ...prev,
      income: monthlyIncome,
    }));
  }

  async function addFixedExpense(input: { name: string; amount: number }) {
    await addRecurringExpense(input);

    const rows = await fetchRecurringExpenses();
    setData((prev) => ({
      ...prev,
      recurringExpenses: rows,
    }));
  }

  async function removeFixedExpense(id: string) {
    await disableRecurringExpense(id);

    setData((prev) => ({
      ...prev,
      recurringExpenses: prev.recurringExpenses.filter((e: any) => e.id !== id),
    }));
  }

  return {
    data,
    addTransaction,
    setIncome,
    addFixedExpense,
    removeFixedExpense,
  };
}
