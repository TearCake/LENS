import os
import pandas as pd
import joblib
import uuid
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from app.core.config import settings
from app.mlflow_manager import mlflow_manager
from app.ml.preprocessing import create_preprocessing_pipeline, analyze_dataset, clean_dataset
from app.ml.trainers import MODEL_REGISTRY
from app.ml.evaluation import evaluate_model
from app.ml.explainability import generate_global_shap

import math

def clean_for_json(obj):
    """Recursively clean an object to make it strictly JSON compliant, replacing NaNs and Infs with None."""
    if isinstance(obj, dict):
        return {k: clean_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_for_json(v) for v in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    return obj

# Global state for tracking training progress
TRAINING_JOBS = {}

def run_training_experiment(experiment_run_id: str, dataset_id: str, target_column: str, models_to_train: list):
    try:
        TRAINING_JOBS[experiment_run_id] = {
            "status": "running",
            "progress": 5,
            "current_step": "Loading dataset",
            "results": [],
            "error": None
        }
        
        # 1. Load dataset
        dataset_path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}.csv")
        if not os.path.exists(dataset_path):
            raise FileNotFoundError(f"Dataset {dataset_id} not found.")
        
        df = pd.read_csv(dataset_path)
        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' was not found in the dataset.")
        
        # 2. Clean numeric-like columns (e.g. TotalCharges with spaces)
        df = clean_dataset(df, target_column)
        
        # 3. Analyze and separate features and target
        dataset_info = analyze_dataset(df, target_column)
        id_cols = dataset_info.get("id_columns", [])
        cols_to_drop = [c for c in ([target_column] + id_cols) if c and c in df.columns]
        X = df.drop(columns=cols_to_drop)
        y = df[target_column]
    
        # Simple check for target type (assuming classification for MVP)
        if y.dtype == 'object' or len(y.unique()) < 20:
            pass # Classification is fine
        else:
            raise ValueError("Target appears to be continuous, regression not yet supported.")
        
        # Encode target classes to integers [0, 1, ..., k-1] for estimators (XGBoost requires integer classes)
        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y.astype(str) if y.dtype == 'object' else y)
        target_classes = [str(c) for c in label_encoder.classes_]

        # Split data
        TRAINING_JOBS[experiment_run_id]["progress"] = 20
        TRAINING_JOBS[experiment_run_id]["current_step"] = "Preprocessing data"
    
        try:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
            )
        except Exception:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y_encoded, test_size=0.2, random_state=42
            )
    
        # Create and fit pipeline
        preprocessor = create_preprocessing_pipeline(
            dataset_info['numerical_columns'], 
            dataset_info['categorical_columns']
        )
    
        X_train_transformed = preprocessor.fit_transform(X_train)
        X_test_transformed = preprocessor.transform(X_test)
    
        # Save the pipeline and label encoder
        pipeline_id = str(uuid.uuid4())
        pipeline_path = os.path.join(settings.MODEL_DIR, f"preprocessor_{pipeline_id}.joblib")
        joblib.dump(preprocessor, pipeline_path)
        
        label_encoder_path = os.path.join(settings.MODEL_DIR, f"label_encoder_{pipeline_id}.joblib")
        joblib.dump(label_encoder, label_encoder_path)
    
        results = []

        # Get feature names with prefixes stripped (e.g. num__tenure -> tenure)
        feature_names = []
        try:
            raw_fnames = preprocessor.get_feature_names_out()
            feature_names = [str(f).replace("num__", "").replace("cat__", "") for f in raw_fnames]
        except Exception:
            feature_names = [f"feature_{i}" for i in range(X_train_transformed.shape[1])]
    
        total_models = len(models_to_train)
    
        for idx, model_name in enumerate(models_to_train):
            if model_name not in MODEL_REGISTRY:
                continue
                
            TRAINING_JOBS[experiment_run_id]["progress"] = 30 + int((idx / total_models) * 60)
            TRAINING_JOBS[experiment_run_id]["current_step"] = f"Training {model_name}"
                
            train_func = MODEL_REGISTRY[model_name]
            
            # Start MLflow run
            run_name = f"{model_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            with mlflow_manager.start_run(run_name=run_name) as run:
                # Train
                model, training_time, raw_params = train_func(X_train_transformed, y_train)
                
                import math
                params = {}
                for k, v in raw_params.items():
                    if isinstance(v, float) and math.isnan(v):
                        params[k] = None
                    else:
                        params[k] = v
                
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
                feature_importance_list = []
                
                TRAINING_JOBS[experiment_run_id]["current_step"] = f"Generating SHAP for {model_name}"
                try:
                    explainer, plot_path, feature_importance = generate_global_shap(
                        model, X_train_transformed, model_name, shap_output_dir, feature_names=list(feature_names)
                    )
                    
                    # Convert feature importance to list corresponding to feature_names
                    feature_importance_list = feature_importance.tolist()
                    
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
                mlflow_manager.log_artifact(label_encoder_path, "label_encoder")
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
                        "label_encoder": label_encoder_path,
                        "explainer": explainer_path,
                        "shap_plot": plot_path
                    },
                    "target_classes": target_classes,
                    "numerical_columns": dataset_info.get("numerical_columns", []),
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
                    "feature_importance": feature_importance_list,
                    "created_at": datetime.now().isoformat(),
                    "pipeline_path": pipeline_path,
                    "label_encoder_path": label_encoder_path,
                    "target_classes": target_classes,
                    "numerical_columns": dataset_info.get("numerical_columns", []),
                    "explainer_path": explainer_path
                }, metadata_path)
                
        results = clean_for_json(results)
        
        TRAINING_JOBS[experiment_run_id]["progress"] = 100
        TRAINING_JOBS[experiment_run_id]["current_step"] = "Completed"
        TRAINING_JOBS[experiment_run_id]["status"] = "completed"
        TRAINING_JOBS[experiment_run_id]["results"] = results
            
        return {
            "experiment_id": experiment_run_id,
            "results": results
        }
    except Exception as e:
        TRAINING_JOBS[experiment_run_id] = {
            "status": "failed",
            "progress": 0,
            "current_step": "Error",
            "error": str(e),
            "results": []
        }
        raise e
