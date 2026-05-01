import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import datetime
from pymongo import MongoClient

# 🔹 Import modules
from modules.fft import extract_signatures
from modules.dataset_builder import build_dataset
from modules.ocsvm_model import run_ocsvm
from modules.dbscan_model import run_dbscan
from modules.evaluation import compute_metrics
from modules.compare_models import compare_models

app = Flask(__name__)
CORS(app)

# ==============================
# ✅ MongoDB (GLOBAL CONNECTION - FIXED)
# ==============================
try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
    db = client["optical_fiber_security_db"]
    collection = db["pipeline_results"]
    client.server_info()  # force connection test
    print("✅ MongoDB Connected")
except Exception as e:
    print("❌ MongoDB Connection Failed:", e)
    collection = None


# ==============================
# 🔹 SAFE DB SAVE
# ==============================
def save_to_db(record):
    if collection is None:
        return
    try:
        collection.insert_one(record)
    except Exception as e:
        print("DB Error:", e)


# ==============================
# 🔹 COMMON PIPELINE
# ==============================
def run_pipeline():
    stokes = np.random.rand(2000, 3)

    delta = np.diff(stokes, axis=0)
    npsv = np.sqrt(np.sum(delta**2, axis=1))

    seg_len = 1000
    n_segments = len(npsv) // seg_len

    if n_segments == 0:
        raise ValueError("Not enough data")

    segments = npsv[:n_segments * seg_len].reshape(n_segments, seg_len)

    signatures = extract_signatures(segments)
    dataset = build_dataset(signatures)

    return dataset


# ==============================
# 🔹 HOME
# ==============================
@app.route("/")
def home():
    return "Backend Running 🚀"


# ==============================
# 🔹 MODULE 1 (WITH DB)
# ==============================
@app.route("/module1")
def module1():
    try:
        stokes = np.random.rand(5000, 3)

        delta = np.diff(stokes, axis=0)
        npsv = np.sqrt(np.sum(delta**2, axis=1))

        seg_len = 1000
        n_segments = len(npsv) // seg_len

        if n_segments > 0:
            segments = npsv[:n_segments * seg_len].reshape(n_segments, seg_len)
            segments_shape = list(segments.shape)
        else:
            segments_shape = [0, 0]

        record = {
            "module": "module1",
            "timestamp": str(datetime.datetime.now()),
            "npsv_length": int(len(npsv)),
            "segments_shape": segments_shape,
            "npsv_sample": npsv[:200].tolist()
        }

        save_to_db(record)

        return jsonify({
            "status": "success",
            "npsv_length": record["npsv_length"],
            "segments_shape": record["segments_shape"],
            "npsv": record["npsv_sample"]
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# ==============================
# 🔹 MODULE 2
# ==============================
@app.route("/module2")
def module2():
    try:
        stokes = np.random.rand(2000, 3)

        delta = np.diff(stokes, axis=0)
        npsv = np.sqrt(np.sum(delta**2, axis=1))

        seg_len = 1000
        n_segments = len(npsv) // seg_len

        if n_segments == 0:
            return jsonify({"status": "error", "message": "Not enough data"})

        segments = npsv[:n_segments * seg_len].reshape(n_segments, seg_len)
        sig = extract_signatures(segments)

        return jsonify({
            "status": "success",
            "length": int(sig.size),
            "data": sig.flatten().tolist()[:200]
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# ==============================
# 🔹 MODULE 3
# ==============================
@app.route("/module3")
def module3():
    try:
        data = run_pipeline()

        return jsonify({
            "status": "success",
            "train_size": int(data["train_size"]),
            "test_size": int(data["test_size"]),
            "y_test": data["y_test"][:200].tolist()
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# ==============================
# 🔹 MODULE 4 (OCSVM)
# ==============================
@app.route("/module4")
def module4():
    try:
        data = run_pipeline()

        preds, acc = run_ocsvm(
            data["X_train"],
            data["X_test"],
            data["y_test"]
        )

        return jsonify({
            "status": "success",
            "data": {
                "accuracy": float(acc),
                "y_test": data["y_test"].tolist(),
                "predictions": preds.tolist()
            }
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# ==============================
# 🔹 MODULE 5 (DBSCAN)
# ==============================
@app.route("/module5")
def module5():
    try:
        data = run_pipeline()

        preds, labels, f1 = run_dbscan(
            data["X_test"],
            data["y_test"]
        )

        return jsonify({
            "status": "success",
            "data": {
                "f1_score": float(f1),
                "y_test": data["y_test"].tolist(),
                "predictions": preds.tolist(),
                "clusters": labels.tolist()
            }
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# ==============================
# 🔹 MODULE 6
# ==============================
@app.route("/module6")
def module6():
    try:
        data = run_pipeline()

        oc_pred, _ = run_ocsvm(
            data["X_train"],
            data["X_test"],
            data["y_test"]
        )

        db_pred, _, _ = run_dbscan(
            data["X_test"],
            data["y_test"]
        )

        oc_metrics = compute_metrics(data["y_test"], oc_pred)
        db_metrics = compute_metrics(data["y_test"], db_pred)

        return jsonify({
            "status": "success",
            "ocsvm": oc_metrics,
            "dbscan": db_metrics
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# ==============================
# 🔹 COMPARE (FIXED → POST)
# ==============================
@app.route("/compare", methods=["POST"])
def compare():
    try:
        data = run_pipeline()
        result = compare_models(data)

        return jsonify({
            "status": "success",
            "results": result
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# ==============================
# 🚀 RUN
# ==============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)