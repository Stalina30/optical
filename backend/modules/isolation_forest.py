from sklearn.ensemble import IsolationForest
import numpy as np
from modules.evaluation import compute_metrics

def run_isolation_forest(X_train, X_test, y_test):
    model = IsolationForest(
        n_estimators=100,
        contamination=0.2,
        random_state=42
    )

    model.fit(X_train)

    preds = model.predict(X_test)

    # Convert → 1=normal, -1=anomaly → 0/1
    preds = np.where(preds == 1, 0, 1)

    metrics = compute_metrics(y_test, preds)

    return preds, metrics