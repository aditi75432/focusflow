import axios from "axios";
import * as cheerio from "cheerio";
import { uploadToBlob } from "../lib/blob.config";
import { Content_outputsContainer, PreferencesContainer } from "../lib/db.config";

import { getUserPreferences } from "./getUserPreferences";
import { processTextWorker } from "./process.text.worker";
import { OutputStyle } from "../types/textprocessing";

import { downloadBlobAsBuffer } from "../utils/blobDownloadHelper";


export const extractTextFromURL = async (url: string): Promise<string> => {
  try {
    const { data } = await axios.get(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    $("script").remove();
    $("style").remove();
    $("nav").remove();
    $("footer").remove();
    $("header").remove();
    $("noscript").remove();
    $("iframe").remove();
    $("ad").remove(); 

    const text = $("article").length ? $("article").text() : $("body").text();
    const cleanText = text.replace(/\s+/g, " ").trim();

    if (!cleanText || cleanText.length < 50) {
      throw new Error("Could not extract meaningful text from URL");
    }

    return cleanText;
  } catch (error: any) {
    throw new Error(`Failed to extract text from URL: ${error.message}`);
  }
};


export const processLinkInBackground = async ({
  contentId,
  userId,
  outputStyle,
  initialResource,
}: {
  contentId: string;
  userId: string;
  outputStyle: OutputStyle;
  initialResource?: any;
}) => {
  try {
    let resource = initialResource;

    // 1️⃣ Load content_outputs record
    if (!resource) {
      const { resource: dbResource } =
        await Content_outputsContainer.item(contentId, userId).read();
      resource = dbResource;
    }

    if (!resource) {
      throw new Error("Content output not found");
    }

    console.log(
      `[LinkSummarizer] Loaded contentId=${contentId}, outputStyle=${outputStyle}`
    );

    // 2️⃣ Resolve URL
    let url = "";

    if (
      typeof resource.rawStorageRef === "string" &&
      resource.rawStorageRef.startsWith("http")
    ) {
      url = resource.rawStorageRef;
    } else if (typeof resource.rawStorageRef === "string") {
      // In case URL was stored as text/blob
      const buffer = await downloadBlobAsBuffer(resource.rawStorageRef);
      url = buffer.toString("utf-8").trim();
    }

    if (!url.startsWith("http")) {
      throw new Error("Invalid URL provided");
    }

    // 3️⃣ Extract readable text from webpage
    const extractedText = await extractTextFromURL(url);

    // 4️⃣ Fetch user preferences
    const preferences = await getUserPreferences(userId);

    // 5️⃣ Delegate to shared worker
    await processTextWorker({
      contentId,
      userId,
      outputStyle,
      text: extractedText,
      preferences,
    });

    console.log(
      `[LinkSummarizer] Worker dispatched for contentId=${contentId}`
    );
  } catch (error: any) {
    console.error(
      `[LinkSummarizer] FATAL ERROR for contentId=${contentId}`,
      error
    );

    await Content_outputsContainer.item(contentId, userId).patch([
      { op: "set", path: "/status", value: "FAILED" },
      {
        op: "set",
        path: "/errorMessage",
        value: error.message || "Link processing failed",
      },
    ]);
  }
};

// export const processLinkToBionic = async ({
//   contentId,
//   userId,
//   linkBuffer,
//   preferences,
// }: LinkProcessInput) => {
//   console.time(`[Link Pipeline] ${contentId}`);
//   console.log(`[Link Pipeline] ${new Date().toISOString()} - Processing contentId: ${contentId}`);
//   try {
//     // 1️⃣ Extract text from URL
//     console.log(`[Link] Extracting text from: ${linkBuffer}`);
//     const rawText = await extractTextFromURL(linkBuffer);

//     // 2️⃣ Summarize
//     console.log(`[Link] Summarizing text...`);
//     const summary = await summarizeText(rawText,preferences);

//     // 3️⃣ Generate Bionic JSON
//     console.log(`[Link] Generating Bionic JSON...`);
//     const bionicJSON = await generateBionicJSON(summary,preferences);

//     // 4️⃣ Upload processed JSON to Blob
//     console.log(`[Link] Uploading to Blob...`);
//     const processedFile = {
//       buffer: Buffer.from(JSON.stringify(bionicJSON)),
//       originalname: `${contentId}-bionic.json`,
//       mimetype: "application/json",
//     } as Express.Multer.File;

//     const { storageRef, blobName } = await uploadToBlob(
//       processedFile,
//       "text"
//     );
//     console.log(`[Link Pipeline] ${new Date().toISOString()} - Upload to Blob finished.`);

//     // 5️⃣ Update Cosmos DB
//     console.log(`[Link] Updating Cosmos DB...`);
//     const { resource } =
//       await Content_outputsContainer.item(contentId, userId).read();

//     if (!resource) {
//       throw new Error("Content output not found");
//     }

//     Object.assign(resource, {
//       processedStorageRef: storageRef,
//       processedBlobName: blobName,
//       processedContainerName: "content-processed",
//       outputFormat: "BIONIC_TEXT",
//       status: "READY",
//       processedAt: new Date().toISOString(),
//       usedPreferences: {
//         detailLevel: preferences?.detailLevel,
//         preferredOutput: preferences?.preferredOutput,
//         adhdLevel: preferences?.aiEvaluation?.adhdLevel,
//       },
//     });

//     await Content_outputsContainer
//       .item(contentId, userId)
//       .replace(resource);
    
//     console.log(`[Link Pipeline] ${new Date().toISOString()} - Process completed for contentId: ${contentId}`);
//     console.timeEnd(`[Link Pipeline] ${contentId}`);
//     return resource;
//   } catch (error: any) {
//     console.error("[Link Processing Error]", error.message);

//     await Content_outputsContainer
//       .item(contentId, userId)
//       .patch([
//         { op: "set", path: "/status", value: "FAILED" },
//         {
//           op: "set",
//           path: "/errorMessage",
//           value: error.message || "Link processing failed",
//         },
//       ]);

//     throw error;
//   }
// };
