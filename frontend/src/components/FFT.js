import React, { useState } from "react";

function FFT() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runModule2 = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/module2");

      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();
      console.log("FFT Response:", data);

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
      <h2>Module 2: FFT</h2>

      <button onClick={runModule2}>Run Module 2</button>

      {loading && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && result.status === "success" && (
        <div>
          <h3>Total Values: {result.length}</h3>

          <div
            style={{
              height: "400px",
              overflowY: "scroll",
              border: "1px solid black",
              marginTop: "10px",
            }}
          >
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>FFT Value</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(result.data) &&
                  result.data.map((value, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>
                        {typeof value === "number"
                          ? value.toFixed(4)
                          : "0.0000"}
                      </td>
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

export default FFT;