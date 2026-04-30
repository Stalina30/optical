import React, { useState } from "react";
import "./App.css";
import SOP from "./components/SOP";
import FFT from "./components/FFT";
import Dataset from "./components/Dataset";
import OCSVM from "./components/OCSVM";
import DBSCAN from "./components/DBSCAN";
import Evaluation from "./components/Evaluation";
import CompareModels from "./components/CompareModels";

function App() {
  const [fileLoaded, setFileLoaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);

  const modules = [
    "SOP Data Acquisition & NPSV Processing Module",
    "SOP Signature Extraction Module (FFT-Based)",
    "Dataset Construction & Labeling Module",
    "OCSVM-Based Anomaly Detection Module",
    "DBSCAN-Based Unsupervised Detection Module",
    "Performance Evaluation & Metrics Module",
    " Isolation Forest"
  ];

  // 🔹 Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileLoaded(true);
    }
  };

  // 🔹 Back button
  const goBack = () => {
    setSelectedModule(null);
  };

  return (
    <div className="container">

      <h1 className="title">
        Optical Fiber Security using SOP & Machine Learning
      </h1>

      {/* 🔹 Upload Section */}
      {!fileLoaded && (
        <div className="upload-box">
          <input type="file" onChange={handleFileUpload} />
          <p>Upload SOP Dataset (CSV)</p>
        </div>
      )}

      {/* 🔹 Module List */}
      {fileLoaded && selectedModule === null && (
        <div className="modules-box">
          <h2>Dataset Loaded: {fileName}</h2>
          <h3>System Modules</h3>

          <ul>
            {modules.map((module, index) => (
              <li key={index}>
                <button
                  className="module-btn"
                  onClick={() => setSelectedModule(index)}
                >
                  {module}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Module 1 */}
      {selectedModule === 0 && (
        <div className="result-box">
          <button className="back-btn" onClick={goBack}>
            ⬅ Back
          </button>

          <h2>{modules[0]}</h2>

          <SOP />
        </div>
      )}
      {selectedModule === 1 && (
        <div className="result-box">
          <button className="back-btn" onClick={goBack}>
            ⬅ Back
          </button>

          <FFT />
        </div>
      )}
      {selectedModule === 2 && (
        <div className="result-box">
          <button className="back-btn" onClick={goBack}>
            ⬅ Back
          </button>
          <Dataset />
        </div>
      )}
      {selectedModule === 3 && (
        <div className="result-box">
          <button className="back-btn" onClick={goBack}>
            ⬅ Back
          </button>
          <OCSVM />
        </div>
      )}
      {selectedModule === 4 && (
        <div className="result-box">
          <button className="back-btn" onClick={goBack}>
            ⬅ Back
          </button>
        <DBSCAN />
        </div>
      )}
      {selectedModule === 5 && (
  
        <div className="result-box">
          <button className="back-btn" onClick={goBack}>
            ⬅ Back
          </button>
        <Evaluation />
        </div>
      )}
      {selectedModule === 6 && (
      <div>
        <button className="back-btn" onClick={goBack}>
          ⬅ Back</button>
        <CompareModels />
     </div>
      )}
      
    </div>
  );
}

export default App;
