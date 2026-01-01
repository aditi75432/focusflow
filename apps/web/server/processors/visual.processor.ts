import { Content_outputsContainer } from "../lib/db.config";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { VISUAL_PROMPT } from "./prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
  },
});




export const generateVisualOutput = async ({
  contentId,
  userId,
  text,
  preferences,
}: {
  contentId: string;
  userId: string;
  text: string;
  preferences : any;
}) => {
  const prompt = VISUAL_PROMPT(text,preferences);
  const result = await geminiModel.generateContent(prompt);
  const visualJSON = JSON.parse(result.response.text());

  await Content_outputsContainer.item(contentId, userId).patch([
    { op: "set", path: "/processedData", value: visualJSON },
    { op: "set", path: "/outputFormat", value: "VISUAL_JSON" },
    { op: "set", path: "/status", value: "READY" },
    { op: "set", path: "/processedAt", value: new Date().toISOString() },
  ]);
};
