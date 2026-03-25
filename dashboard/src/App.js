import { useState } from "react";

// In production deployments, set REACT_APP_API_URL in Vercel environment variables.
// This fallback is only for local dev / missing env configuration.
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://qa360-saas-platform-production.up.railway.app";

function isValidTestUrl(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | running | passed | failed

  const [errorText, setErrorText] = useState("");
  const [logs, setLogs] = useState([]);
  const [errors, setErrors] = useState([]);
  const [summary, setSummary] = useState("");
  const [performance, setPerformance] = useState({});
  const [screenshotBase64, setScreenshotBase64] = useState(null);

  const runTest = async () => {
    setErrorText("");
    setStatus("running");
    setLogs([]);
    setErrors([]);
    setSummary("");
    setPerformance({});
    setScreenshotBase64(null);

    if (!API_URL || !API_URL.trim()) {
      setStatus("failed");
      setErrorText("❌ Backend URL not configured");
      return;
    }

    if (!isValidTestUrl(url)) {
      setStatus("idle");
      setErrorText("Please enter a valid http or https URL.");
      return;
    }

    const trimmedUrl = url.trim();
    const apiBase = API_URL.replace(/\/$/, "");

    // Basic client-side timeout to avoid hanging fetches.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({}));

      const ok = Boolean(data?.success);
      const nextStatus = ok ? "passed" : "failed";
      setStatus(nextStatus);

      setLogs(Array.isArray(data?.logs) ? data.logs : []);
      setErrors(Array.isArray(data?.errors) ? data.errors : []);
      setSummary(data?.summary || "");
      setPerformance(data?.performance || {});

      const base64 = data?.data?.screenshotBase64;
      if (typeof base64 === "string" && base64.length > 0) {
        setScreenshotBase64(base64);
      }

      if (!res.ok && !ok) {
        // Backend returns structured error response; show the primary error if present.
        setErrorText(
          (Array.isArray(data?.errors) ? data.errors[0] : null) ||
            data?.message ||
            `Request failed (${res.status})`
        );
      }
    } catch (err) {
      setStatus("failed");
      const message =
        err?.name === "AbortError"
          ? "❌ Request timed out."
          : "❌ Could not reach backend.";
      setErrorText(message);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const statusLabel =
    status === "idle"
      ? "Idle"
      : status === "running"
        ? "Running"
        : status === "passed"
          ? "Passed"
          : "Failed";

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "48px",
        fontFamily: "system-ui, Arial",
        maxWidth: "760px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "0 16px",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>QA360 Website Testing Tool</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>Enter any website URL to test</p>

      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "10px", width: "100%" }}
        disabled={loading}
      />

      <div style={{ marginTop: 16 }}>
        <button onClick={runTest} disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Running..." : "Run Test"}
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        <p style={{ margin: 0 }}>
          <strong>Status:</strong> {statusLabel}
        </p>
      </div>

      {errorText && (
        <p style={{ color: "red", marginTop: "14px" }}>{errorText}</p>
      )}

      {(logs.length > 0 || errors.length > 0 || summary || screenshotBase64) && (
        <div
          style={{
            marginTop: 20,
            textAlign: "left",
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          {summary && (
            <p style={{ marginTop: 0, marginBottom: 12 }}>
              <strong>Summary:</strong> {summary}
            </p>
          )}

          {performance && performance.totalMs !== undefined && (
            <p style={{ marginTop: 0, marginBottom: 12 }}>
              <strong>Performance:</strong>{" "}
              {typeof performance.totalMs === "number"
                ? `${performance.totalMs}ms total`
                : "—"}
            </p>
          )}

          {screenshotBase64 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ margin: "0 0 8px 0" }}>
                <strong>Screenshot:</strong>
              </p>
              <img
                src={`data:image/png;base64,${screenshotBase64}`}
                alt="Test screenshot"
                style={{ width: "100%", maxHeight: 420, objectFit: "contain", background: "#fff" }}
              />
            </div>
          )}

          {errors.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ margin: "0 0 8px 0" }}>
                <strong>Errors:</strong>
              </p>
              <pre
                style={{
                  background: "#120000",
                  color: "#ff6b6b",
                  padding: "10px",
                  overflowX: "auto",
                  maxHeight: "240px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {errors.join("\n")}
              </pre>
            </div>
          )}

          {logs.length > 0 && (
            <div>
              <p style={{ margin: "0 0 8px 0" }}>
                <strong>Logs:</strong>
              </p>
              <pre
                style={{
                  background: "#000",
                  color: "#0f0",
                  padding: "10px",
                  overflowX: "auto",
                  maxHeight: "240px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {logs.join("\n")}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;