import React, { useState } from "react";

function Dataset() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runModule3 = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/module3");

      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();
      console.log("Dataset Response:", data);

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

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Module 3: Dataset</h2>

      <button onClick={runModule3}>Run Module 3</button>

      {loading && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && result.status === "success" && (
        <div>
          <h3>Train Size: {result.train_size}</h3>
          <h3>Test Size: {result.test_size}</h3>

          {/* 🔹 Show sample test labels */}
          <h3>Test Labels (Sample)</h3>

          <div
            style={{
              height: "300px",
              overflowY: "scroll",
              border: "1px solid black",
              marginTop: "10px",
            }}
          >
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Label</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(result.y_test) &&
                  result.y_test.map((val, i) => (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{val}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dataset;