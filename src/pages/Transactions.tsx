import { useState } from "react";
import { useBudgetStore } from "@/data/useBudgetStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterableTransactionList from "@/components/transactions/FilterableTransactionList";

export default function Transactions() {
  const { data, addTransaction } = useBudgetStore();

  const [amount, setAmount] = useState("");
  const [bucket, setBucket] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");

  function handleAdd() {
    if (!amount || !bucket) return;

    addTransaction({
      amount: Number(amount),
      bucket,
      note,
    });

    setAmount("");
    setBucket("");
    setNote("");
  }

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[600px] grid lg:grid-cols-12 gap-6">
       {/* Left: Add Form */}
       <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-lg h-full flex flex-col bg-gradient-to-br from-card to-muted/20">
             <CardHeader>
                <CardTitle>New Transaction</CardTitle>
                <CardDescription>Record your daily spending or income</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6 flex-1">
                <Tabs value={type} onValueChange={(v) => setType(v as "expense" | "income")} className="w-full">
                   <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="expense">Expense</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                   </TabsList>
                </Tabs>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Amount</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">₹</span>
                         <Input
                           type="number"
                           placeholder="0.00"
                           className="pl-8 text-lg font-semibold h-12"
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Category / Bucket</label>
                      <Select value={bucket} onValueChange={setBucket}>
                        <SelectTrigger className="h-11">
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
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Note</label>
                      <Input
                        placeholder="What was this for?"
                        className="h-11"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                   </div>
                </div>

                <div className="pt-4 mt-auto">
                   <Button className="w-full h-12 text-base shadow-lg shadow-primary/20" onClick={handleAdd} size="lg">
                     Add {type === 'income' ? 'Income' : 'Expense'}
                   </Button>
                </div>
             </CardContent>
          </Card>
       </div>

       {/* Right: List */}
       <div className="lg:col-span-8 h-full min-h-[500px]">
          <Card className="border-none shadow-sm h-full flex flex-col">
             <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                   <CardTitle>History</CardTitle>
                   <div className="text-sm text-muted-foreground">
                      {data.transactions.length} entries
                   </div>
                </div>
             </CardHeader>
             <CardContent className="flex-1 overflow-hidden">
                <FilterableTransactionList transactions={data.transactions} />
             </CardContent>
          </Card>
       </div>
    </div>
  );
}
