import { Content_outputsContainer, PreferencesContainer } from "../lib/db.config";
import { generateBionicJSON } from "../utils/PdfSummarizer";
import { uploadToBlob } from "../lib/blob.config";
import { SUMMARY_PROMPT } from "./prompts";


import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
  },
});


export const generateSummaryOutput = async ({
  contentId,
  userId,
  text,
  preferences,
}: {
  contentId: string;
  userId: string;
  text: string;
  preferences: any;
}) => {
  const prompt = SUMMARY_PROMPT(text,PreferencesContainer);
  const result = await geminiModel.generateContent(prompt);
  const { summary } = JSON.parse(result.response.text());

  const bionicJSON = await generateBionicJSON(summary, preferences);



  const file = {
    buffer: Buffer.from(JSON.stringify(bionicJSON)),
    originalname: `${contentId}-bionic.json`,
    mimetype: "application/json",
  } as Express.Multer.File;

  const { storageRef, blobName } = await uploadToBlob(file, "text");

  await Content_outputsContainer.item(contentId, userId).patch([
    { op: "set", path: "/processedStorageRef", value: storageRef },
    { op: "set", path: "/processedBlobName", value: blobName },
    { op: "set", path: "/outputFormat", value: "BIONIC_TEXT" },
    { op: "set", path: "/status", value: "READY" },
    { op: "set", path: "/processedAt", value: new Date().toISOString() },
  ]);
};
