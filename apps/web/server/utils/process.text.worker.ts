import { OutputStyle } from "../types/textprocessing";
import {
  generateSummaryOutput,
} from "../processors/summary.processor";
import {
  generateVisualOutput,
} from "../processors/visual.processor";
import {
  generateFlowchartOutput,
} from "../processors/flowchart.processor";
import {
  generateFlashcardsOutput,
} from "../processors/flashcard.processor";
import { Content_outputsContainer } from "../lib/db.config";

export const processTextWorker = async ({
  contentId,
  userId,
  outputStyle,
  text,
  preferences,
}: {
  contentId: string;
  userId: string;
  outputStyle: OutputStyle;
  text: string;
  preferences: any;
}) => {
  try {
    console.log("[Worker] Started", { contentId, outputStyle });

    switch (outputStyle) {
      case "summary":
        await generateSummaryOutput({ contentId, userId, text, preferences });
        break;

      case "visual":
        await generateVisualOutput({ contentId, userId, text, preferences });
        break;

      case "flowchart":
        await generateFlowchartOutput({ contentId, userId, text, preferences });
        break;

      case "flashcards":
        await generateFlashcardsOutput({ contentId, userId, text, preferences });
        break;

      default:
        throw new Error(`Unsupported outputStyle: ${outputStyle}`);
    }
  } catch (err: any) {
    console.error("[Worker] FAILED", err);

    await Content_outputsContainer.item(contentId, userId).patch([
      { op: "set", path: "/status", value: "FAILED" },
      {
        op: "set",
        path: "/errorMessage",
        value: err.message || "Processing failed",
      },
    ]);
  }
};
