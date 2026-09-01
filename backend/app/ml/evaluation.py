from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def evaluate_model(y_true, y_pred, y_prob=None) -> dict:
    """Calculate common classification metrics."""
    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, average='weighted', zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, average='weighted', zero_division=0)),
        "f1_score": float(f1_score(y_true, y_pred, average='weighted', zero_division=0))
    }
    
    if y_prob is not None:
        try:
            # For multi-class or binary
            if len(set(y_true)) == 2:
                metrics["roc_auc"] = float(roc_auc_score(y_true, y_prob[:, 1]))
            else:
                metrics["roc_auc"] = float(roc_auc_score(y_true, y_prob, multi_class='ovr'))
        except Exception:
            pass # ROC AUC might fail depending on classes present in y_true
            
    return metrics
