export interface Bucket {
  id: string;
  name: string;
  limit: number;
  spent: number;
}

export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string | number;
  amount: number;
  bucket: string;
  note: string;
  date: string;
  type?: TransactionType;
  category?: string; // Icon identifier
  tags?: string[];
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
}

export interface BudgetData {
  income: number;
  savingsGoal: number;
  buckets: Bucket[];
  transactions: Transaction[];
  recurringExpenses: FixedExpense[];
}
