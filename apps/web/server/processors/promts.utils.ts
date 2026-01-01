export const buildPreferenceContext = (preferences: any) => {
  if (!preferences) return "";

  const detail = preferences.detailLevel
    ? `Detail level: ${preferences.detailLevel}.`
    : "";

  const adhd = preferences.aiEvaluation?.adhdLevel
    ? `ADHD level: ${preferences.aiEvaluation.adhdLevel}.`
    : "";

  return `
USER PREFERENCES:
${detail}
${adhd}

ADAPTATION RULES:
- If ADHD level is high → shorter sentences, fewer items, simpler language
- If detail level is low → concise output
- If detail level is high → include more explanation, but stay structured
`;
};
