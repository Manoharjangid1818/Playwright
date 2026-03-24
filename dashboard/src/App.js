import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const runTestHandler = async () => {
    if (!url) {
      setResult("Please enter a URL");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/run-test`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );
      const data = await res.json();
      setResult(data.message);
    } catch {
      setResult("❌ Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px", fontFamily: "Arial" }}>
      <h1>QA360 Dashboard 🚀</h1>

      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <button onClick={runTestHandler}>
        {loading ? "Running..." : "Run Test"}
      </button>

      <h3>{result}</h3>
    </div>
  );
}

export default App;