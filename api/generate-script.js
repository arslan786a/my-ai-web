// Node 22+ has native fetch
const AI_ENDPOINTS = {
  chatgpt: "https://ai-api-phi-seven.vercel.app/api/chatgpt",
  deepseek: "https://ai-api-phi-seven.vercel.app/api/deepseek",
  gemini: "https://ai-api-phi-seven.vercel.app/api/gemini",
  grok: "https://ai-api-phi-seven.vercel.app/api/grok",
  qwen: "https://ai-api-phi-seven.vercel.app/api/qwen",
  calude: "https://ai-api-phi-seven.vercel.app/api/calude",
  meta: "https://ai-api-phi-seven.vercel.app/api/meta",
};

// Individual AI call with logging
async function callAI(url, message) {
  console.log(`Calling AI endpoint: ${url} with message:`, message);
  const res = await fetch(`${url}?message=${encodeURIComponent(message)}`);
  const data = await res.json();
  console.log(`Response from ${url}:`, data);
  return { success: data.success, msg: data.msg };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.error("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { requirement } = req.body;
  console.log("API request body:", req.body);

  try {
    // Call all AI endpoints in parallel
    const aiResponses = await Promise.all(
      Object.values(AI_ENDPOINTS).map((url) => callAI(url, requirement))
    );

    console.log("All AI responses collected:", aiResponses);

    // Aggregate AI responses into one prompt for ChatGPT
    const aggregatedInput = aiResponses
      .map((r, i) => `AI${i + 1}: ${r.msg}`)
      .join("\n");

    console.log("Aggregated input for final AI call:", aggregatedInput);

    // Final AI call to ChatGPT
    const finalRes = await callAI(AI_ENDPOINTS.chatgpt, aggregatedInput);

    console.log("Final script generated:", finalRes.msg);

    res.json({
      ok: true,
      finalScript: finalRes.msg,
      allResponses: aiResponses,
    });
  } catch (err) {
    console.error("Error in generate-script API:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
}