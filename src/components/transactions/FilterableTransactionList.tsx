import { useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Transaction } from "@/types/budget";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string | number) => void;
}

export default function FilterableTransactionList({ transactions, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  const filtered = transactions.filter((tx) => {
    const matchesSearch = 
      tx.note.toLowerCase().includes(search.toLowerCase()) || 
      tx.bucket.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === "all" || tx.type === filterType;

    return matchesSearch && matchesType;
  });

  const grouped = filtered.reduce((groups, tx) => {
    const date = new Date(tx.date);
    let key = format(date, "d MMM yyyy");
    if (isToday(date)) key = "Today";
    else if (isYesterday(date)) key = "Yesterday";
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-3 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={(v) => setFilterType(v as "all" | "income" | "expense")}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {Object.entries(grouped).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/40 rounded-xl">
             <p>No transactions found.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur py-2 z-10 w-full">
                {date}
              </h3>
              <div className="space-y-2">
                {txs.map((tx) => (
                  <Card key={tx.id} className="border border-border/60 shadow-sm hover:border-primary/30 transition-all group">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center ${
                          tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'
                        }`}>
                          {/* We can map visual icons here later */}
                          <span className="text-sm font-bold">
                             {tx.bucket[0]?.toUpperCase() || 'E'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm leading-none">{tx.note || tx.bucket}</p>
                          <div className="flex gap-2 mt-1">
                             <p className="text-xs text-muted-foreground">{tx.bucket}</p>
                             {tx.tags?.map(tag => (
                               <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground uppercase">{tag}</span>
                             ))}
                          </div>
                        </div>
                      </div>
                       <div className={`font-semibold text-sm flex items-center gap-3 ${tx.type === 'income' ? 'text-green-600' : ''}`}>
                          <span>{tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Delete button clicked for ID:", tx.id);
                              // Temporary direct call for debugging
                              onDelete(tx.id);
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete transaction"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </button>
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
