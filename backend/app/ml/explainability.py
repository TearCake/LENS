import shap
import matplotlib.pyplot as plt
import os
import numpy as np

def generate_global_shap(model, X_transformed, model_type: str, output_dir: str):
    """Generate SHAP summary plot and feature importance."""
    os.makedirs(output_dir, exist_ok=True)
    
    # Select explainer based on model type
    if model_type in ["random_forest", "xgboost"]:
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X_transformed)
        # Handle XGBoost binary classification where shap_values might be a list
        if isinstance(shap_values, list):
            shap_values = shap_values[1] # Use positive class for binary
    else:
        # Linear models
        explainer = shap.LinearExplainer(model, X_transformed)
        shap_values = explainer.shap_values(X_transformed)

    # Save summary plot
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, X_transformed, show=False)
    plot_path = os.path.join(output_dir, "shap_summary.png")
    plt.savefig(plot_path, bbox_inches='tight')
    plt.close()

    # Calculate global feature importance (mean absolute SHAP value)
    if len(shap_values.shape) > 2:
        # Multi-class output from shap_values
        feature_importance = np.abs(shap_values).mean(0).mean(1)
    else:
        feature_importance = np.abs(shap_values).mean(0)
    
    return explainer, plot_path, feature_importance

def generate_local_shap(explainer, instance_transformed, feature_names):
    """Generate SHAP local explanation for a single prediction."""
    shap_values = explainer.shap_values(instance_transformed)
    if isinstance(shap_values, list):
        shap_values = shap_values[1]
        
    shap_values = shap_values[0] # First (and only) instance
    
    contributions = []
    for i, feature in enumerate(feature_names):
        val = shap_values[i]
        
        # In multi-class, shap_values might still be multi-dimensional
        if isinstance(val, np.ndarray):
            val = val[1] if len(val) > 1 else val[0]
            
        contributions.append({
            "feature": feature,
            "shap_value": float(val),
            "direction": "positive" if val > 0 else "negative"
        })
        
    # Get base value
    base_value = explainer.expected_value
    if isinstance(base_value, (list, np.ndarray)):
        base_value = float(base_value[1] if len(base_value) > 1 else base_value[0])
    else:
        base_value = float(base_value)
        
    return contributions, base_value
