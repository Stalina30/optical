import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import f1_score

def run_dbscan(X_test, y_test):
    """
    DBSCAN anomaly detection:
    - Noise points (-1) → anomaly (1)
    - Cluster points → normal (0)
    """

    # 🔹 Scale data (important)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_test)

    # 🔹 DBSCAN model
    model = DBSCAN(
        eps=1.5,        # distance threshold
        min_samples=5   # minimum points in cluster
    )

    labels = model.fit_predict(X_scaled)

    # 🔹 Convert:
    # -1 → anomaly (1)
    # >=0 → normal (0)
    preds = np.where(labels == -1, 1, 0)

    # 🔹 Metrics
    f1 = f1_score(y_test, preds)

    return preds, labels, f1