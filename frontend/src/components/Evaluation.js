import React, { useState } from "react";

function Evaluation() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const runModule6 = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/module6`);

      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();
      console.log("Evaluation Response:", data);

      if (data.status === "success") {
        setResult(data);
      } else {
        setError(data.message || "Error from backend");
      }
    } catch (err) {
      console.error(err);
      setError("Backend connection failed");
    }

    setLoading(false);
  };

  const MetricBlock = ({ title, m }) => {
    if (!m) return null;

    return (
      <div
        style={{
          border: "1px solid #ccc",
          margin: "10px",
          padding: "10px",
          width: "250px",
        }}
      >
        <h3>{title}</h3>
        <p>TPR: {m.TPR.toFixed(2)}%</p>
        <p>FNR: {m.FNR.toFixed(2)}%</p>
        <p>FPR: {m.FPR.toFixed(2)}%</p>
        <p>TNR: {m.TNR.toFixed(2)}%</p>
        <p>F1 Score: {(m.F1 * 100).toFixed(2)}%</p>
        <p>
          TN: {m.confusion.tn} | FP: {m.confusion.fp} | FN: {m.confusion.fn} | TP: {m.confusion.tp}
        </p>
      </div>
    );
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Module 6: Evaluation</h2>

      <button onClick={runModule6}>Run Module 6</button>

      {loading && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && result.status === "success" && (
        <div>
          <h3>Evaluation Results</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <MetricBlock title="OCSVM" m={result.ocsvm} />
            <MetricBlock title="DBSCAN" m={result.dbscan} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Evaluation;