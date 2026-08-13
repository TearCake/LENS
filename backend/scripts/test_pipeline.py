import os
import sys
import pandas as pd
from sklearn.datasets import load_breast_cancer
import uuid

# Add the project root to sys.path to resolve imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.config import settings
from app.core.paths import ensure_directories
from app.services.training_service import run_training_experiment
from app.services.experiment_service import get_all_experiments
from app.services.model_service import predict_with_model

def main():
    print("Ensuring directories...")
    ensure_directories()
    
    print("Loading sample dataset...")
    data = load_breast_cancer()
    df = pd.DataFrame(data.data, columns=data.feature_names)
    df['target'] = data.target
    
    dataset_id = str(uuid.uuid4())
    df.to_csv(os.path.join(settings.UPLOAD_DIR, f"{dataset_id}.csv"), index=False)
    print(f"Saved dataset {dataset_id}.csv")
    
    print("Starting training pipeline...")
    result = run_training_experiment(
        dataset_id=dataset_id,
        target_column="target",
        models_to_train=["logistic_regression", "random_forest", "xgboost"]
    )
    
    print(f"Experiment completed: {result['experiment_id']}")
    for r in result['results']:
        print(f" - {r['model_name']} ({r['model_id']}): Accuracy = {r['metrics'].get('accuracy'):.4f}")
        
    print("\nVerifying MLflow experiments...")
    experiments = get_all_experiments()
    print(f"Found {len(experiments)} MLflow runs.")
    
    print("\nTesting prediction on first row...")
    first_row = df.drop(columns=['target']).iloc[0].to_dict()
    model_id = result['results'][0]['model_id']
    pred = predict_with_model(model_id, first_row)
    print(f"Prediction for {result['results'][0]['model_name']}: {pred['prediction']} (Prob: {pred['probability']:.4f})")
    print(f"Local SHAP contributions: {len(pred['feature_contributions'])} features evaluated.")

if __name__ == "__main__":
    main()
