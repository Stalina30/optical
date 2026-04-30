import numpy as np
from sklearn.utils import shuffle

def build_dataset(signatures):
    try:
        X = np.array(signatures)

        # 🔹 Ensure 2D
        if len(X.shape) == 1:
            X = X.reshape(-1, 1)

        total, features = X.shape

        # 🔹 Ensure enough data
        if total < 1000:
            print("⚠️ Small dataset — generating synthetic base data")
            X = np.random.normal(0, 1, (1000, features))
            total = 1000

        # 🔹 Shuffle BEFORE split (VERY IMPORTANT)
        X = shuffle(X, random_state=42)

        # 🔹 Take exactly 1000 samples
        X = X[:1000]

        # =============================
        # 🔹 TRAIN (ONLY NORMAL DATA)
        # =============================
        X_train = X[:600]

        # Normalize training data
        mean = np.mean(X_train, axis=0)
        std = np.std(X_train, axis=0) + 1e-6

        X_train = (X_train - mean) / std
        y_train = np.zeros(600)

        # =============================
        # 🔹 TEST DATA
        # =============================

        # Normal test data
        X_test_normal = X[600:800]
        X_test_normal = (X_test_normal - mean) / std
        y_test_normal = np.zeros(200)

        # 🔥 Realistic anomalies (not extreme)
        abnormal = np.random.normal(2, 1.5, (200, features))
        abnormal = (abnormal - mean) / std
        y_abnormal = np.ones(200)

        # Combine
        X_test = np.vstack([X_test_normal, abnormal])
        y_test = np.concatenate([y_test_normal, y_abnormal])

        # Shuffle test set
        X_test, y_test = shuffle(X_test, y_test, random_state=42)

        return {
            "X_train": X_train,
            "y_train": y_train,
            "X_test": X_test,
            "y_test": y_test,
            "train_size": 600,
            "test_size": 400
        }

    except Exception as e:
        print("Dataset Error:", e)
        return None