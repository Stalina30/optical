from modules.ocsvm_model import run_ocsvm
from modules.isolation_forest import run_isolation_forest

def compare_models(data):
    X_train = data["X_train"]
    X_test = data["X_test"]
    y_test = data["y_test"]

   
    _, ocsvm_metrics = run_ocsvm(X_train, X_test, y_test)

  
    _, iso_metrics = run_isolation_forest(X_train, X_test, y_test)

    return {
        "ocsvm": ocsvm_metrics,
        "isolation_forest": iso_metrics
    }