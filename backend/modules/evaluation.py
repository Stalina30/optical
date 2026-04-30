import numpy as np
from sklearn.metrics import confusion_matrix, f1_score

def compute_metrics(y_true, y_pred):
    """
    Returns TPR, FNR, FPR, TNR, F1 (in % except F1)
    Labels:
      0 = normal
      1 = anomaly
    """
    # Ensure numpy arrays
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    # tn, fp, fn, tp
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred, labels=[0, 1]).ravel()

    tpr = 100 * tp / (tp + fn + 1e-9)  # Recall for anomalies
    fnr = 100 * fn / (tp + fn + 1e-9)
    fpr = 100 * fp / (fp + tn + 1e-9)
    tnr = 100 * tn / (fp + tn + 1e-9)
    f1  = f1_score(y_true, y_pred, zero_division=0)

    return {
        "TPR": float(tpr),
        "FNR": float(fnr),
        "FPR": float(fpr),
        "TNR": float(tnr),
        "F1":  float(f1),
        "confusion": {
            "tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)
        }
    }