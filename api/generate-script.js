// no node-fetch needed, Node 18+ has fetch built-in

const AI_ENDPOINTS = {
  chatgpt: "https://ai-api-phi-seven.vercel.app/api/chatgpt",
  deepseek: "https://ai-api-phi-seven.vercel.app/api/deepseek",
  gemini: "https://ai-api-phi-seven.vercel.app/api/gemini",
  grok: "https://ai-api-phi-seven.vercel.app/api/grok",
  qwen: "https://ai-api-phi-seven.vercel.app/api/qwen",
  calude: "https://ai-api-phi-seven.vercel.app/api/calude",
  meta: "https://ai-api-phi-seven.vercel.app/api/meta",
};

async function callAI(url, message) {
  const res = await fetch(`${url}?message=${encodeURIComponent(message)}`);
  const data = await res.json();
  return { success: data.success, msg: data.msg };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { requirement } = req.body;

  try {
    const aiResponses = await Promise.all(
      Object.values(AI_ENDPOINTS).map((url) => callAI(url, requirement))
    );

    const aggregatedInput = aiResponses.map((r, i) => `AI${i + 1}: ${r.msg}`).join("\n");

    const finalRes = await callAI(AI_ENDPOINTS.chatgpt, aggregatedInput);

    res.json({
      ok: true,
      finalScript: finalRes.msg,
      allResponses: aiResponses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}