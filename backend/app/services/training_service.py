import os
import pandas as pd
import joblib
import uuid
from datetime import datetime
from sklearn.model_selection import train_test_split
from app.core.config import settings
from app.mlflow_manager import mlflow_manager
from app.ml.preprocessing import create_preprocessing_pipeline, analyze_dataset
from app.ml.trainers import MODEL_REGISTRY
from app.ml.evaluation import evaluate_model
from app.ml.explainability import generate_global_shap

def run_training_experiment(dataset_id: str, target_column: str, models_to_train: list):
    # 1. Load dataset
    dataset_path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}.csv")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset {dataset_id} not found.")
        
    df = pd.read_csv(dataset_path)
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' was not found in the dataset.")
        
    # 2. Preprocess
    dataset_info = analyze_dataset(df, target_column)
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    # Simple check for target type (assuming classification for MVP)
    if y.dtype == 'object' or len(y.unique()) < 20:
        pass # Classification is fine
    else:
        raise ValueError("Target appears to be continuous, regression not yet supported.")
        
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Create and fit pipeline
    preprocessor = create_preprocessing_pipeline(
        dataset_info['numerical_columns'], 
        dataset_info['categorical_columns']
    )
    
    X_train_transformed = preprocessor.fit_transform(X_train)
    X_test_transformed = preprocessor.transform(X_test)
    
    # Save the pipeline
    pipeline_id = str(uuid.uuid4())
    pipeline_path = os.path.join(settings.MODEL_DIR, f"preprocessor_{pipeline_id}.joblib")
    joblib.dump(preprocessor, pipeline_path)
    
    experiment_run_id = str(uuid.uuid4())
    results = []

    # Get feature names if possible
    feature_names = []
    try:
        feature_names = preprocessor.get_feature_names_out()
    except:
        feature_names = [f"feature_{i}" for i in range(X_train_transformed.shape[1])]
    
    for model_name in models_to_train:
        if model_name not in MODEL_REGISTRY:
            continue
            
        train_func = MODEL_REGISTRY[model_name]
        
        # Start MLflow run
        run_name = f"{model_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        with mlflow_manager.start_run(run_name=run_name) as run:
            # Train
            model, training_time, params = train_func(X_train_transformed, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test_transformed)
            y_prob = None
            if hasattr(model, "predict_proba"):
                y_prob = model.predict_proba(X_test_transformed)
                
            metrics = evaluate_model(y_test, y_pred, y_prob)
            metrics['training_time'] = training_time
            
            # SHAP
            model_id = str(uuid.uuid4())
            shap_output_dir = os.path.join(settings.SHAP_DIR, model_id)
            explainer_path = None
            try:
                explainer, plot_path, feature_importance = generate_global_shap(
                    model, X_train_transformed, model_name, shap_output_dir
                )
                
                # Save explainer for local predictions
                explainer_path = os.path.join(settings.MODEL_DIR, f"explainer_{model_id}.joblib")
                joblib.dump(explainer, explainer_path)
            except Exception as e:
                plot_path = None
                print(f"SHAP generation failed for {model_name}: {e}")
                
            # Log to MLflow
            mlflow_manager.log_params({
                "model_name": model_name,
                "target_column": target_column,
                "dataset_id": dataset_id,
                **params
            })
            mlflow_manager.log_metrics(metrics)
            mlflow_manager.log_tags({
                "project": "LENS",
                "dataset_id": dataset_id,
                "model_name": model_name,
                "model_id": model_id,
                "experiment_id": experiment_run_id
            })
            
            # Save Model
            model_path = os.path.join(settings.MODEL_DIR, f"model_{model_id}.joblib")
            joblib.dump(model, model_path)
            
            mlflow_manager.log_artifact(pipeline_path, "pipeline")
            mlflow_manager.log_artifact(model_path, "model")
            if plot_path:
                mlflow_manager.log_artifact(plot_path, "shap")
                
            results.append({
                "model_id": model_id,
                "run_id": run.info.run_id,
                "model_name": model_name,
                "model_version": "v1",
                "dataset_id": dataset_id,
                "parameters": params,
                "metrics": metrics,
                "training_time": training_time,
                "artifact_paths": {
                    "model": model_path,
                    "pipeline": pipeline_path,
                    "explainer": explainer_path,
                    "shap_plot": plot_path
                },
                "feature_names": list(feature_names)
            })
            
            # Also save metadata to disk for quick retrieval
            metadata_path = os.path.join(settings.MODEL_DIR, f"metadata_{model_id}.joblib")
            joblib.dump({
                "model_id": model_id,
                "run_id": run.info.run_id,
                "model_name": model_name,
                "version": "v1",
                "metrics": metrics,
                "feature_names": list(feature_names),
                "created_at": datetime.now().isoformat(),
                "pipeline_path": pipeline_path,
                "explainer_path": explainer_path
            }, metadata_path)
            
    return {
        "experiment_id": experiment_run_id,
        "results": results
    }
