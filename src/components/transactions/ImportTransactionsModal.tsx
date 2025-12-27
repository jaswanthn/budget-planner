import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { classifyTransactions } from "@/lib/gemini";
import { parseStatementFile, ParsedTransaction } from "@/utils/fileParser";
import { useBudgetStore } from "@/data/useBudgetStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Loader2, Sparkles, UploadCloud, FileSpreadsheet, CheckCircle2 } from "lucide-react";

export default function ImportTransactionsModal() {
  const [open, setOpen] = useState(false);
  const { data, addTransaction, addBucket } = useBudgetStore();
  const buckets = data.buckets.map(b => b.name);

  const [step, setStep] = useState<"upload" | "review" | "success">("upload");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const ensureBucketsExist = async (mapping: Record<string, string>) => {
    const uniqueBuckets = new Set(Object.values(mapping));
    const newBuckets = Array.from(uniqueBuckets).filter(b => b && b !== "Uncategorized" && !buckets.includes(b));
    
    if (newBuckets.length > 0 && addBucket) {
       // Create buckets in parallel (settled to avoid partial failures blocking all)
       await Promise.allSettled(newBuckets.map(b => addBucket(b)));
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setLoading(true);
    try {
      const parsed = await parseStatementFile(acceptedFiles[0]);
      
      // Auto-run AI Classification
      const mapping = await classifyTransactions(
        parsed.map(t => ({ id: t.id, note: t.note, amount: t.amount })),
        buckets
      );
      
      // specific logic for onDrop to ensure buckets exist before setting state
      const uniqueBuckets = new Set(Object.values(mapping));
      const newBuckets = Array.from(uniqueBuckets).filter(b => b && b !== "Uncategorized" && !buckets.includes(b));
      if (newBuckets.length > 0 && addBucket) {
           await Promise.allSettled(newBuckets.map(b => addBucket(b)));
      }

      const classified = parsed.map(t => ({
         ...t,
         bucket: mapping[t.id] || "Uncategorized"
      }));

      setTransactions(classified);
      setSelectedIds(new Set(classified.map(t => t.id))); 
      setStep("review");
    } catch (err) {
      console.error("Parse error", err);
    } finally {
      setLoading(false);
    }
  }, [buckets, addBucket]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 
        'text/csv': ['.csv'], 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  const handleAIClassify = async () => {
    setLoading(true);
    const toClassify = transactions.filter(t => selectedIds.has(t.id));
    const mapping = await classifyTransactions(
        toClassify.map(t => ({ id: t.id, note: t.note, amount: t.amount })), 
        buckets
    );
    
    await ensureBucketsExist(mapping);
    
    setTransactions(prev => prev.map(t => {
        if (mapping[t.id]) {
            return { ...t, bucket: mapping[t.id] };
        }
        return t;
    }));
    setLoading(false);
  };

  const updateTransaction = (id: string, field: keyof ParsedTransaction, value: any) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleImport = async () => {
     setLoading(true);
     // Simulate slight delay for UX
     await new Promise(r => setTimeout(r, 600));

     const toImport = transactions.filter(t => selectedIds.has(t.id));
     
     await Promise.all(toImport.map(t => 
         addTransaction({
             amount: t.amount,
             note: t.note,
             bucket: t.bucket || "Uncategorized",
             occurredAt: t.date 
         })
     ));

     setLoading(false);
     setStep("success");
     setTimeout(() => {
         setOpen(false);
         setStep("upload");
         setTransactions([]);
     }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full border border-border/50 hover:bg-muted/80 gap-2 h-12 flex items-center justify-center shadow-sm">
             <UploadCloud className="w-4 h-4" />
             <span className="text-sm font-medium">Import Statement</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col !bg-white dark:!bg-slate-950" style={{ backgroundColor: '#ffffff' }}>
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload your bank statement (CSV or Excel) to bulk import transactions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-[400px] flex flex-col">
            {step === "upload" && (
                <div 
                    {...getRootProps()} 
                    className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors cursor-pointer
                        ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:bg-muted/50'}
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        {loading ? <Loader2 className="animate-spin text-muted-foreground" /> : <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />}
                    </div>
                    <p className="font-medium text-lg">
                        {loading ? "Parsing file..." : "Drag & drop file here"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                    <div className="mt-4 flex gap-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded">.CSV</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">.XLSX</span>
                    </div>
                </div>
            )}

            {step === "review" && (
                <div className="flex flex-col h-full space-y-4">
                    <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                {selectedIds.size} selected
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
                                onClick={handleAIClassify}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                                AI Smart Classify
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border flex-1 overflow-hidden relative">
                        <div className="absolute inset-0 overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 sticky top-0 z-10">
                                    <tr className="border-b text-left">
                                        <th className="p-3 w-10">
                                            <Checkbox 
                                                checked={selectedIds.size === transactions.length}
                                                onCheckedChange={(c) => setSelectedIds(c ? new Set(transactions.map(t => t.id)) : new Set())}
                                            />
                                        </th>
                                        <th className="p-3 font-medium text-muted-foreground w-32">Date</th>
                                        <th className="p-3 font-medium text-muted-foreground">Description</th>
                                        <th className="p-3 font-medium text-muted-foreground w-28 text-right">Amount</th>
                                        <th className="p-3 font-medium text-muted-foreground w-48">Bucket</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {transactions.map(t => (
                                        <tr key={t.id} className={`group ${!selectedIds.has(t.id) ? 'opacity-50 grayscale' : 'hover:bg-muted/20'}`}>
                                            <td className="p-3 text-center">
                                                <Checkbox 
                                                    checked={selectedIds.has(t.id)} 
                                                    onCheckedChange={() => toggleSelection(t.id)}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <Input 
                                                    type="date"
                                                    value={t.date.split('T')[0]} 
                                                    onChange={e => updateTransaction(t.id, 'date', e.target.value)}
                                                    className="h-7 w-full px-1 py-0 bg-transparent border-transparent hover:border-input focus:border-primary"
                                                />
                                            </td>
                                            <td className="p-3">
                                                 <Input 
                                                    value={t.note} 
                                                    onChange={e => updateTransaction(t.id, 'note', e.target.value)}
                                                    className="h-7 w-full px-1 py-0 bg-transparent border-transparent hover:border-input focus:border-primary"
                                                />
                                            </td>
                                            <td className="p-3 text-right font-mono">
                                                <span className={t.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {t.amount.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <Select value={t.bucket} onValueChange={v => updateTransaction(t.id, 'bucket', v)}>
                                                    <SelectTrigger className={`h-7 w-full ${!t.bucket ? 'border-amber-300 bg-amber-50 text-amber-700' : ''}`}>
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {buckets.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                                        <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

             {step === "success" && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold">Import Successful!</h3>
                    <p className="text-muted-foreground">Your transactions have been added.</p>
                </div>
            )}
        </div>

        <DialogFooter className="mt-4">
             {step === 'review' && (
                 <>
                    <Button variant="ghost" onClick={() => setStep("upload")}>Back</Button>
                    <Button onClick={handleImport} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Import {selectedIds.size} Transactions
                    </Button>
                 </>
             )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
