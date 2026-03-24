// dashboard/src/App.js
import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Use backend URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  // Function to run the test
  const runTestHandler = async () => {
    if (!url) {
      setResult("Please enter a URL");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch(`${API_URL}/run-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data.message || "Test completed successfully!");
    } catch (err) {
      console.error(err);
      setResult("❌ Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>QA360 Dashboard 🚀</h1>

      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br />
      <br />

      <button
        onClick={runTestHandler} // eslint-friendly name
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Running..." : "Run Test"}
      </button>

      <h3>{result}</h3>
    </div>
  );
}

export default App;