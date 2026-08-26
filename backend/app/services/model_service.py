import os
import joblib
import pandas as pd
import numpy as np
from app.core.config import settings
from app.ml.explainability import generate_local_shap

def get_model_metadata(model_id_or_run_id: str):
    # Direct model_id file check
    direct_path = os.path.join(settings.MODEL_DIR, f"metadata_{model_id_or_run_id}.joblib")
    if os.path.exists(direct_path):
        return joblib.load(direct_path)
    
    # Search all metadata files by run_id or model_id
    if os.path.exists(settings.MODEL_DIR):
        for f in os.listdir(settings.MODEL_DIR):
            if f.startswith("metadata_") and f.endswith(".joblib"):
                try:
                    meta = joblib.load(os.path.join(settings.MODEL_DIR, f))
                    if meta.get("run_id") == model_id_or_run_id or meta.get("model_id") == model_id_or_run_id:
                        return meta
                except Exception:
                    pass

    raise FileNotFoundError(f"Model metadata for {model_id_or_run_id} not found.")

def predict_with_model(model_id_or_run_id: str, features: dict):
    metadata = get_model_metadata(model_id_or_run_id)
    actual_model_id = metadata.get("model_id", model_id_or_run_id)
    
    model_path = os.path.join(settings.MODEL_DIR, f"model_{actual_model_id}.joblib")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file model_{actual_model_id}.joblib not found.")
    model = joblib.load(model_path)
    
    pipeline_path = metadata.get('pipeline_path')
    if not pipeline_path or not os.path.exists(pipeline_path):
        raise FileNotFoundError("Preprocessing pipeline not found.")
        
    pipeline = joblib.load(pipeline_path)
    
    # Convert features to DataFrame
    df = pd.DataFrame([features])
    
    # Transform
    X_transformed = pipeline.transform(df)
    
    # Predict
    prediction = model.predict(X_transformed)[0]
    probability = 1.0
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(X_transformed)[0]
        if len(probs) == 2:
            probability = float(probs[1])
        else:
            probability = float(max(probs))
            
    # SHAP local explanation
    explainer_path = metadata.get('explainer_path')
    contributions = []
    base_value = 0.0
    
    if explainer_path and os.path.exists(explainer_path):
        try:
            explainer = joblib.load(explainer_path)
            feature_names = metadata.get('feature_names', [f"feature_{i}" for i in range(X_transformed.shape[1])])
            contributions, base_value = generate_local_shap(explainer, X_transformed, feature_names)
        except Exception as e:
            print(f"Local SHAP failed: {e}")
            
    return {
        "prediction": int(prediction) if isinstance(prediction, (int, np.integer)) else float(prediction) if isinstance(prediction, (float, np.floating)) else prediction,
        "probability": probability,
        "base_value": base_value,
        "feature_contributions": contributions,
        "model_id": actual_model_id,
        "model_version": metadata.get("version", "v1")
    }

def compare_models(model_id_a: str, model_id_b: str):
    meta_a = get_model_metadata(model_id_a)
    meta_b = get_model_metadata(model_id_b)
    
    delta = {}
    for k, v in meta_b.get("metrics", {}).items():
        val_a = meta_a.get("metrics", {}).get(k, 0)
        delta[k] = v - val_a
        
    feature_names_a = meta_a.get("feature_names", [])
    feature_importances_a = meta_a.get("feature_importance", [])
    
    feature_names_b = meta_b.get("feature_names", [])
    feature_importances_b = meta_b.get("feature_importance", [])
    
    fc_delta = []
    
    for i, name in enumerate(feature_names_b):
        if name in feature_names_a and i < len(feature_importances_b):
            idx_a = feature_names_a.index(name)
            if idx_a < len(feature_importances_a):
                val_a = feature_importances_a[idx_a]
                val_b = feature_importances_b[i]
                diff = val_b - val_a
                
                fc_delta.append({
                    "feature": name,
                    "delta": float(diff),
                    "baseline": float(val_a),
                    "comparison": float(val_b)
                })
                
    return {
        "model": meta_a.get("model_name"),
        "version_a": meta_a,
        "version_b": meta_b,
        "performance_delta": delta,
        "prediction_shift": {}, 
        "feature_contribution_delta": fc_delta
    }
