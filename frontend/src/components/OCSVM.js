import React, { useState } from "react";

function OCSVM() {
  const [result, setResult] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const runModule4 = async () => {
    const res = await fetch(`${API_URL}/module4`);
    const data = await res.json();
    setResult(data);
  };

  const data = result?.data;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>OCSVM Anomaly Detection</h2>

      <button onClick={runModule4}>Run Module 4</button>

      {data && (
        <div>
          <h3>Accuracy: {(data.accuracy * 100).toFixed(2)}%</h3>

          <table border="1" style={{ margin: "auto" }}>
            <thead>
              <tr>
                <th>Index</th>
                <th>Actual</th>
                <th>Predicted</th>
              </tr>
            </thead>
            <tbody>
              {data.y_test.slice(0, 100).map((val, i) => (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{val}</td>
                  <td>{data.predictions[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OCSVM;