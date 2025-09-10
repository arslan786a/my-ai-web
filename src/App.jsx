import { useState, useEffect } from "react";

export default function App({ logFn }) {
  const [requirement, setRequirement] = useState("");
  const [finalScript, setFinalScript] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (logFn) logFn("App.jsx mounted");
    else console.log("App.jsx mounted");
  }, []);

  const generateScript = async () => {
    if (logFn) logFn("Generate script called with requirement: " + requirement);
    setLoading(true);
    setFinalScript("");

    try {
      // Replace this with your real API
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement }),
      });

      const data = await res.json();

      if (logFn) logFn("API response: " + JSON.stringify(data));
      else console.log("API response:", data);

      if (data.ok) {
        setFinalScript(data.finalScript);
        if (logFn) logFn("Final script updated");

        // Automatic redirect after 2 seconds
        setTimeout(() => {
          if (logFn) logFn("Redirecting to next page...");
          window.location.href = "/next.html"; // Change to your next page
        }, 2000);

      } else {
        const errorMsg = data.error || "Unknown error";
        if (logFn) logFn("Error generating script: " + errorMsg);
        else console.error("Error generating script:", errorMsg);
      }
    } catch (e) {
      if (logFn) logFn("Fetch error: " + e);
      else console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalScript);
    if (logFn) logFn("Script copied to clipboard");
    else console.log("Script copied to clipboard");
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
          if (logFn) logFn("Requirement changed: " + e.target.value);
        }}
      />

      <button
        onClick={generateScript}
        style={{ marginTop: 10, padding: "10px 20px", fontSize: 16 }}
        disabled={loading}
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