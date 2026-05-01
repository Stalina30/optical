import React, { useState } from "react";

function CompareModels() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const runCompare = async () => {
    setError("");
    setResults(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (data.status === "success") {
        setResults(data.results);
      } else {
        setError(data.message || "Error from backend");
      }

    } catch (err) {
      console.error(err);
      setError("Backend connection failed");
    }

    setLoading(false);
  };

  // 🔹 Convert safely to %
  const formatPercent = (val) => {
    if (val === undefined || val === null) return "0.00%";
    if (val > 1) return val.toFixed(2) + "%";
    return (val * 100).toFixed(2) + "%";
  };

  // 🔹 UI Block
  const MetricBlock = ({ title, m }) => {
    if (!m) return <p>No data for {title}</p>;

    return (
      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          margin: "10px",
          width: "260px"
        }}
      >
        <h3>{title}</h3>
        <p>TPR: {formatPercent(m.TPR)}</p>
        <p>FNR: {formatPercent(m.FNR)}</p>
        <p>FPR: {formatPercent(m.FPR)}</p>
        <p>TNR: {formatPercent(m.TNR)}</p>
        <p>F1 Score: {formatPercent(m.F1)}</p>

        <p>
          TN: {m.confusion?.tn ?? 0} | 
          FP: {m.confusion?.fp ?? 0} | 
          FN: {m.confusion?.fn ?? 0} | 
          TP: {m.confusion?.tp ?? 0}
        </p>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Model Comparison</h2>

      <button onClick={runCompare}>Run Comparison</button>

      {loading && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {results && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
        
          <MetricBlock title="Isolation Forest" m={results.isolation_forest} />
        </div>
      )}
    </div>
  );
}

export default CompareModels;