import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you set VITE_GEMINI_API_KEY in your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const classifyTransactions = async (
  transactions: { id: string; note: string; amount: number }[],
  buckets: string[]
): Promise<Record<string, string>> => {
  if (!API_KEY) {
    console.warn("Gemini API Key missing. Skipping AI classification.");
    return {};
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  // Batching: LLMs have context limits, but 50-100 tx per batch is usually fine.
  // For safety, let's just send the text list.
  const txListStr = transactions
    .map((t) => `ID: ${t.id} | Desc: ${t.note} | Amount: ${t.amount}`)
    .join("\n");

  const prompt = `
      You are an AI financial assistant. 
      Your task is to classify bank transactions.
      
      Available Buckets: ${buckets.join(", ")}
      
      Instructions:
      1. Analyze the 'Desc' (Description) field.
      2. Map to an existing Bucket if it fits reasonably well.
      3. **CRITICAL**: If NO existing bucket fits, SUGGEST A NEW SHORT CATEGORY NAME (e.g. "Dining", "Transport", "Subscription"). 
      4. Avoid "Uncategorized" unless absolutely impossible to guess.
      5. Strict Output: Return ONLY a valid JSON object. No Markdown. Matches only.

      Transactions:
      ${txListStr}

      Output Format:
      { "tx_a": "ExistingBucket", "tx_b": "NewSuggestedBucket" }
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown code blocks if the model ignores instruction
    const jsonStr = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Classification failed:", error);
    return {};
  }
};
