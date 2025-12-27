import { useEffect, useState } from "react";
import { BudgetData, Transaction } from "@/types/budget";
import {
  fetchBuckets,
  fetchTransactions,
  createBucket,
} from "@/api/budget.api";
import { createTransaction, deleteTransaction } from "@/api/transactions.api";
import { supabase } from "@/lib/supabase";
import { fetchLatestIncome, saveIncome } from "@/api/income.api";
import {
  fetchRecurringExpenses,
  addRecurringExpense,
  disableRecurringExpense,
} from "@/api/recurringExpenses.api";
import { fetchLatestSavingsGoal, saveSavingsGoal } from "@/api/savingsGoal.api";

const STORAGE_KEY = "budget_planner_v1";

const DEFAULT_DATA: BudgetData = {
  income: 0,
  savingsGoal: 0,
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
        savingsGoal:
          typeof parsed.savingsGoal === "number" ? parsed.savingsGoal : 0,
      };
    } catch {
      return DEFAULT_DATA;
    }
  });

  /* ----------------------------------------
   * Persist locally (cache / offline)
   * --------------------------------------*/
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  /* ----------------------------------------
   * Sync from Supabase (READ)
   * --------------------------------------*/
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) return;

      try {
        const [
          bucketRows,
          transactionRows,
          incomeRow,
          recurringExpenseRows,
          savingsGoalRow,
        ] = await Promise.all([
          fetchBuckets(),
          fetchTransactions(),
          fetchLatestIncome(),
          fetchRecurringExpenses(),
          fetchLatestSavingsGoal(),
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
            type: t.type || "expense",
            category: t.category || "shopping-bag",
            tags: t.tags || [],
          })),
          income: incomeRow?.monthly_income ?? prev.income,
          savingsGoal: savingsGoalRow?.monthly_goal ?? prev.savingsGoal,
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
   * Write actions
   * --------------------------------------*/

  async function addTransaction(input: {
    amount: number;
    bucket: string;
    note?: string;
    occurredAt?: string;
  }) {
    let bucketRecord = data.buckets.find((b) => b.name === input.bucket);

    if (!bucketRecord) {
      if (data.buckets.length > 0) {
        console.warn(
          `Bucket "${input.bucket}" not found. Falling back to "${data.buckets[0].name}".`
        );
        bucketRecord = data.buckets[0];
      } else {
        console.error(
          `Bucket "${input.bucket}" not found and no other buckets available. Transaction ignored.`
        );
        return;
      }
    }

    const optimisticId = Date.now();
    const optimisticTx: Transaction = {
      id: optimisticId,
      amount: input.amount,
      bucket: input.bucket,
      note: input.note ?? "",
      date: input.occurredAt || new Date().toISOString(),
      type: "expense",
      category: "shopping-bag",
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
      const newTx = await createTransaction({
        bucketId: bucketRecord.id,
        amount: input.amount,
        note: input.note,
        occurredAt: input.occurredAt || new Date().toISOString().slice(0, 10),
      });

      if (newTx && newTx.id) {
        setData((prev) => ({
          ...prev,
          transactions: prev.transactions.map((t) =>
            t.id === optimisticId ? { ...t, id: newTx.id } : t
          ),
        }));
      }
    } catch (e) {
      console.error("Failed to persist transaction", e);
    }
  }

  async function deleteTransactionAction(id: string | number) {
    const txToDelete = data.transactions.find(
      (tx) => String(tx.id) === String(id)
    );
    if (!txToDelete) return;

    // Optimistic Update
    setData((prev) => {
      const filtered = prev.transactions.filter(
        (t) => String(t.id) !== String(id)
      );
      return {
        ...prev,
        buckets: prev.buckets.map((b) =>
          b.name === txToDelete.bucket
            ? { ...b, spent: b.spent - txToDelete.amount }
            : b
        ),
        transactions: filtered,
      };
    });

    try {
      await deleteTransaction(id);
    } catch (e) {
      console.error("Failed to delete transaction", e);
    }
  }

  async function setIncome(monthlyIncome: number) {
    await saveIncome(monthlyIncome);
    setData((prev) => ({ ...prev, income: monthlyIncome }));
  }

  async function addFixedExpense(input: { name: string; amount: number }) {
    await addRecurringExpense(input);
    const rows = await fetchRecurringExpenses();
    setData((prev) => ({ ...prev, recurringExpenses: rows }));
  }

  async function removeFixedExpense(id: string) {
    await disableRecurringExpense(id);
    setData((prev) => ({
      ...prev,
      recurringExpenses: prev.recurringExpenses.filter((e: any) => e.id !== id),
    }));
  }

  async function setSavingsGoal(monthlySavingsGoal: number) {
    await saveSavingsGoal(monthlySavingsGoal);
    setData((prev) => ({ ...prev, savingsGoal: monthlySavingsGoal }));
  }

  async function addBucketAction(name: string) {
    try {
      const newBucket = await createBucket(name, 0);
      setData((prev) => ({
        ...prev,
        buckets: [
          ...prev.buckets,
          {
            id: newBucket.id,
            name: newBucket.name,
            limit: newBucket.monthly_limit,
            spent: 0,
          },
        ],
      }));
      return newBucket;
    } catch (e) {
      console.error("Failed to create bucket", e);
      throw e;
    }
  }

  return {
    data,
    addTransaction,
    deleteTransaction: deleteTransactionAction,
    setIncome,
    setSavingsGoal,
    addFixedExpense,
    removeFixedExpense,
    addBucket: addBucketAction,
  };
}
