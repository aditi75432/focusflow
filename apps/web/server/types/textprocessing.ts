export type OutputStyle =
  | "summary"
  | "visual"
  | "flowchart"
  | "flashcards";


export const OUTPUT_STYLE_VALUES: OutputStyle[] = [
  "summary",
  "visual",
  "flowchart",
  "flashcards",
];

export interface ProcessTextRequest {
  contentId: string;
  inputType: "text" | "pdf" | "link";
  rawText?: string;
  outputStyle: OutputStyle; // ✅ NOW VALID
}
