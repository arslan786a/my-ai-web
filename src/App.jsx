import { useState, useEffect } from "react";

export default function App() {
  const [requirement, setRequirement] = useState("");
  const [finalScript, setFinalScript] = useState("");
  const [loading, setLoading] = useState(false);

  // Lifecycle log
  useEffect(() => {
    console.log("App.jsx mounted");
  }, []);

  const generateScript = async () => {
    console.log("Generate script called with requirement:", requirement);
    setLoading(true);
    setFinalScript("");

    try {
      // Simulate API call (replace with real API)
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement }),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (data.ok) {
        setFinalScript(data.finalScript);
        console.log("Final script updated");

        // Redirect after 2 seconds (optional)
        setTimeout(() => {
          console.log("Redirecting to next page...");
          window.location.href = "/next.html"; // change to your next page
        }, 2000);
      } else {
        console.error("Error generating script:", data.error);
        alert("Error generating script");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalScript);
    console.log("Script copied to clipboard");
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
          console.log("Requirement changed:", e.target.value);
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