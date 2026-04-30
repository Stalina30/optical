import React, { useState } from "react";

function SOP() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runModule1 = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/module1");

      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();
      console.log("API Response:", data);

      if (data.status === "success") {
        setResult(data);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Backend connection failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Module 1</h2>

      <button onClick={runModule1}>Run Module 1</button>

      {loading && <p>Processing...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3>NPSV Length: {result.npsv_length}</h3>

          <h3>
            Segments Shape:{" "}
            {result.segments_shape
              ? result.segments_shape.join(", ")
              : "Not available"}
          </h3>

          {/* 🔹 Scrollable Table */}
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
                  <th>Value</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(result.npsv) &&
                  result.npsv.map((val, i) => (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>
                        {typeof val === "number"
                          ? val.toFixed(4)
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

export default SOP;