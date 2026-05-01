import React, { useState } from "react";

function DBSCAN() {
  const [result, setResult] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const runModule5 = async () => {
    const res = await fetch(`${API_URL}/module5`);
    const data = await res.json();
    setResult(data);
  };

  const data = result?.data;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>DBSCAN Anomaly Detection</h2>

      <button onClick={runModule5}>Run Module 5</button>

      {data && (
        <div>
          <h3>F1 Score: {(data.f1_score * 100).toFixed(2)}%</h3>

          <table border="1" style={{ margin: "auto" }}>
            <thead>
              <tr>
                <th>Index</th>
                <th>Actual</th>
                <th>Predicted</th>
                <th>Cluster</th>
              </tr>
            </thead>
            <tbody>
              {data.y_test.slice(0, 100).map((val, i) => (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{val}</td>
                  <td>{data.predictions[i]}</td>
                  <td>{data.clusters[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DBSCAN;