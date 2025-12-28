import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/extension/process", async (req: Request, res: Response) => {
  try {
    const { content, mode } = req.body;
    if (!content) return res.status(400).json({ error: "No content provided" });

    console.log(`[Extension-Engine] Processing ${mode} request...`);

    // ADHD transformation logic
    const transformed = mode === "SOCRATIC" 
      ? "Socratic Insight: What is the main problem being solved here? Focus on the solution path."
      : "Simplified Insight: High-level overview extracted to prevent mental overload.";

    res.json({ success: true, transformedContent: transformed });
  } catch (error: any) {
    res.status(500).json({ error: "Transformation failed" });
  }
});

app.listen(4000, () => console.log("Extension Engine active on http://localhost:4000"));