import numpy as np
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

def run_ocsvm(X_train, X_test, y_test):
    # 🔹 Scale data (VERY IMPORTANT)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 🔹 OCSVM model (paper-based)
    model = OneClassSVM(
        kernel="rbf",
        nu=0.05,
        gamma="scale"
    )

    # 🔹 Train only on NORMAL data
    model.fit(X_train_scaled)

    # 🔹 Predict
    preds = model.predict(X_test_scaled)

    # Convert: +1 → 0 (normal), -1 → 1 (anomaly)
    preds = np.where(preds == -1, 1, 0)

    # 🔹 Accuracy
    acc = accuracy_score(y_test, preds)

    return preds, acc