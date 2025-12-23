export interface Bucket {
  id: string;          // 👈 REQUIRED now
  name: string;
  limit: number;
  spent: number;
}


export interface Transaction {
  id: number;
  amount: number;
  bucket: string;
  note: string;
  date: string;
}

export interface BudgetData {
  income: number;
  buckets: Bucket[];
  transactions: Transaction[];
}