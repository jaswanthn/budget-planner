import { useState } from "react";
import { useBudgetStore } from "@/data/useBudgetStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionList from "@/components/TransactionsList";

export default function Transactions() {
  const { data, addTransaction } = useBudgetStore();

  const [amount, setAmount] = useState("");
  const [bucket, setBucket] = useState("");
  const [note, setNote] = useState("");

  function handleAdd() {
    if (!amount || !bucket) return;

    addTransaction({
      amount: Number(amount),
      bucket,
      note
    });

    setAmount("");
    setBucket("");
    setNote("");
  }

  return (
      <div className="space-y-6 max-w-md">
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Select value={bucket} onValueChange={setBucket}>
          <SelectTrigger>
            <SelectValue placeholder="Select bucket" />
          </SelectTrigger>
          <SelectContent>
            {data.buckets.map((b) => (
              <SelectItem key={b.name} value={b.name}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button className="w-full" onClick={handleAdd}>
          Add Transaction
        </Button>
      </CardContent>
    </Card>

    <div>
      <h3 className="text-sm font-medium mb-2">
        Recent transactions
      </h3>

      <TransactionList transactions={data.transactions} />
    </div>
    </div>
  );
}
