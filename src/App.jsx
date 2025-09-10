import { useState, useEffect } from "react";

const AI_ENDPOINTS = {
  chatgpt: "https://ai-api-phi-seven.vercel.app/api/chatgpt",
  deepseek: "https://ai-api-phi-seven.vercel.app/api/deepseek",
  gemini: "https://ai-api-phi-seven.vercel.app/api/gemini",
  grok: "https://ai-api-phi-seven.vercel.app/api/grok",
  qwen: "https://ai-api-phi-seven.vercel.app/api/qwen",
  calude: "https://ai-api-phi-seven.vercel.app/api/calude",
  meta: "https://ai-api-phi-seven.vercel.app/api/meta",
};

// Individual AI call (GET)
async function callAI(url, message, logFn) {
  logFn?.(`Calling AI endpoint: ${url} with message: "${message}"`);
  const res = await fetch(`${url}?message=${encodeURIComponent(message)}`);
  const data = await res.json();
  logFn?.(`Response from ${url}: ${JSON.stringify(data)}`);
  return { success: data.success, msg: data.msg };
}

export default function App({ logFn }) {
  const [requirement, setRequirement] = useState("");
  const [finalScript, setFinalScript] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logFn?.("App.jsx mounted");
  }, []);

  const generateScript = async () => {
    logFn?.("Generate script called with requirement: " + requirement);
    setLoading(true);
    setFinalScript("");

    try {
      // Call all AI endpoints in parallel
      const aiResponses = await Promise.all(
        Object.values(AI_ENDPOINTS).map((url) => callAI(url, requirement, logFn))
      );

      logFn?.("All AI responses collected");

      // Aggregate responses for final script
      const aggregatedInput = aiResponses.map((r, i) => `AI${i + 1}: ${r.msg}`).join("\n");

      // Final AI call (e.g., ChatGPT) to generate script
      const finalRes = await callAI(AI_ENDPOINTS.chatgpt, aggregatedInput, logFn);

      setFinalScript(finalRes.msg);
      logFn?.("Final script updated");

      // Auto redirect after 2 seconds
      setTimeout(() => {
        logFn?.("Redirecting to next page...");
        window.location.href = "/next.html"; // change as needed
      }, 2000);
    } catch (err) {
      logFn?.("Error in generateScript: " + err);
      alert("Error generating script");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalScript);
    logFn?.("Script copied to clipboard");
    alert("Script copied!");
  };

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", fontFamily: "Arial" }}>
      <h1>Multi-AI Script Generator</h1>

      <textarea
        rows={6}
        style={{ width: "100%", fontFamily: "monospace", fontSize: 16 }}
        placeholder="Enter your requirement here..."
        value={requirement}
        onChange={(e) => {
          setRequirement(e.target.value);
          logFn?.("Requirement changed: " + e.target.value);
        }}
      />

      <button
        onClick={generateScript}
        style={{ marginTop: 10, padding: "10px 20px", fontSize: 16 }}
        disabled={loading || !requirement.trim()}
      >
        {loading ? "Generating..." : "Generate Script"}
      </button>

      {finalScript && (
        <div style={{ marginTop: 20 }}>
          <h3>Final Script:</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: 10,
              borderRadius: 5,
              whiteSpace: "pre-wrap",
            }}
          >
            {finalScript}
          </pre>
          <button
            onClick={copyToClipboard}
            style={{ marginTop: 10, padding: "5px 15px" }}
          >
            Copy Script
          </button>
        </div>
      )}
    </div>
  );
}