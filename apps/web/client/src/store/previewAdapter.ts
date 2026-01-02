export function paragraphsToPlainText(data: any): string {
 // if (!data || !Array.isArray(data.paragraphs)) return "";

  return data.paragraphs
     .flatMap((p: any) => p.sentences.map((s: any) => s.text))
    .join("\n\n");
}


// type OutputStyle = "summary" | "visual" | "flowchart" | "flashcards";

// /* ---------------- CORE ADAPTER ---------------- */
// export function contentToPlainText(
//   data: any,
//   outputStyle: OutputStyle
// ): string {

//   switch (outputStyle) {
//     case "summary":
//       return summaryToPlainText(data);

//     case "visual":
//       return visualToPlainText(data);

//     case "flashcards":
//       return flashcardsToPlainText(data);

//     case "flowchart":
//       return flowchartToPlainText(data);

//   }
// }

// /* ---------------- SUMMARY ---------------- */
// function summaryToPlainText(data: any): string {

//   return data.paragraphs
//     .flatMap((p: any) => p.sentences.map((s: any) => s.text))
//     .join("\n\n");
// }

// /* ---------------- VISUAL ---------------- */
// function visualToPlainText(data: any): string {
//   if (!Array.isArray(data?.steps)) return "";

//   return data.steps
//     .map((step: string, index: number) => `${index + 1}. ${step}`)
//     .join("\n");
// }

// /* ---------------- FLASHCARDS ---------------- */
// function flashcardsToPlainText(data: any): string {
//   if (!Array.isArray(data?.cards)) return "";

//   return data.cards
//     .map(
//       (card: any, index: number) =>
//         `Q${index + 1}: ${card.question}\nA: ${card.answer}`
//     )
//     .join("\n\n");
// }

// /* ---------------- FLOWCHART ---------------- */
// function flowchartToPlainText(data: any): string {
//   if (!Array.isArray(data?.edges) || !Array.isArray(data?.nodes)) return "";

//   const nodeMap = new Map(
//     data.nodes.map((n: any) => [n.id, n.label])
//   );

//   return data.edges
//     .map((e: any) => {
//       const from = nodeMap.get(e.from) ?? e.from;
//       const to = nodeMap.get(e.to) ?? e.to;
//       return `${from} → ${e.label} → ${to}`;
//     })
//     .join("\n");
// }
