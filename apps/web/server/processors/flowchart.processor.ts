import { Content_outputsContainer } from "../lib/db.config";
import { FLOWCHART_PROMPT } from "./prompts";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
  },
});


export const generateFlowchartOutput = async ({
  contentId,
  userId,
  text,
  preferences,
}: {
  contentId: string;
  userId: string;
  text: string;
  preferences:any;
}) => {
  
  const prompt = FLOWCHART_PROMPT(text,preferences);
  const result = await geminiModel.generateContent(prompt);
  const flowchartJSON = JSON.parse(result.response.text());

  await Content_outputsContainer.item(contentId, userId).patch([
    { op: "set", path: "/processedData", value: flowchartJSON },
    { op: "set", path: "/outputFormat", value: "FLOWCHART_JSON" },
    { op: "set", path: "/status", value: "READY" },
    { op: "set", path: "/processedAt", value: new Date().toISOString() },
  ]);
};
