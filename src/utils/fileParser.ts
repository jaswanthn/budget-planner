import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParsedTransaction {
  id: string; // Temporary ID for list management
  date: string;
  note: string;
  amount: number;
  bucket?: string;
  originalRow: any; // Keep original data for debugging/reference
}

export const parseStatementFile = async (
  file: File
): Promise<ParsedTransaction[]> => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    return parseCSV(file);
  } else if (extension === "xlsx" || extension === "xls") {
    return parseExcel(file);
  } else {
    throw new Error("Unsupported file format. Please use CSV or Excel.");
  }
};

const parseCSV = (file: File): Promise<ParsedTransaction[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = mapToStandardFormat(results.data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      },
      error: (error) => reject(error),
    });
  });
};

const parseExcel = async (file: File): Promise<ParsedTransaction[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  return mapToStandardFormat(jsonData);
};

const mapToStandardFormat = (data: any[]): ParsedTransaction[] => {
  return data.map((rawRow, index) => {
    // Normalize keys: trim whitespace and lowercase
    const row: Record<string, any> = {};
    Object.keys(rawRow).forEach((key) => {
      row[key.trim().toLowerCase()] = rawRow[key];
    });

    const findValueFuzzy = (patterns: RegExp[]) => {
      for (const key of Object.keys(row)) {
        for (const pattern of patterns) {
          if (pattern.test(key)) {
            const val = cleanAmount(row[key]);
            if (val !== 0) return val;
          }
        }
      }
      return 0;
    };

    // 1. Detect Date
    const dateStr =
      findValueString(row, [/date/i, /val.*dt/i, /txn.*dt/i]) || "";

    // 2. Detect Note/Description
    const note =
      findValueString(row, [
        /narration/i,
        /desc/i,
        /particulars/i,
        /memo/i,
        /remarks/i,
      ]) || "Unknown Transaction";

    // 3. Detect Amount
    let amount = 0;

    // Priority 1: Explicit "Amount" column (but ensure it's not "Withdrawal Amount")
    // Use strict check for "amount" or "amt" exactly, or "transaction amount"
    const explicitAmount = findValueFuzzy([
      /^amount$/i,
      /^amt$/i,
      /^transaction amount$/i,
    ]);

    if (explicitAmount !== 0) {
      amount = explicitAmount;
    } else {
      // Look for splits
      const withdrawal = findValueFuzzy([
        /withdrawal/i,
        /debit/i,
        /^dr$/i,
        /dr.*amount/i,
      ]);

      const deposit = findValueFuzzy([
        /deposit/i,
        /credit/i,
        /^cr$/i,
        /cr.*amount/i,
      ]);

      amount = deposit - withdrawal;
    }

    // Try to parse Date object
    let date = new Date().toISOString();
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        date = d.toISOString();
      }
    }

    return {
      id: `tx_${index}_${Date.now()}`,
      date: date,
      note: String(note).trim(),
      amount: amount,
      originalRow: rawRow,
    };
  });
};

// Helper for strings (returns first match)
const findValueString = (row: Record<string, any>, patterns: RegExp[]) => {
  for (const key of Object.keys(row)) {
    for (const pattern of patterns) {
      if (pattern.test(key)) {
        return row[key];
      }
    }
  }
  return null;
};
const cleanAmount = (val: any): number => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const str = String(val)
    .replace(/,/g, "")
    .replace(/[^0-9.-]/g, ""); // Remove commas, keep numbers, dot, minus
  return parseFloat(str) || 0;
};
