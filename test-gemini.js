
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("No API KEY found in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    // The node SDK doesn't always expose listModels directly on the main class easily in older versions,
    // but looking at documentation, usually we can get a model and check or just try a basic one.
    // Actually, newer SDKs have genAI.getGenerativeModelRoot()... no.
    // Let's just try to instantiate the model and run a dummy prompt.
    // If list_models is supported via REST, I can curl it.
    
    // Attempting to use the flash model directly to see exact error
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash-001");
  } catch (e) {
    console.log("Error with gemini-1.5-flash-001:", e.message);
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash");
  } catch (e) {
    console.log("Error with gemini-1.5-flash:", e.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-pro");
  } catch (e) {
     console.log("Error with gemini-pro:", e.message);
  }
}

listModels();
