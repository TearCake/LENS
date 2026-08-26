from app.mlflow_manager import mlflow_manager
from app.services.training_service import clean_for_json
import pandas as pd

def get_all_experiments():
    runs = mlflow_manager.search_runs()
    if runs is None or runs.empty:
        return []
    
    experiments = []
    for _, row in runs.iterrows():
        # Handle timestamp safely
        start_time_val = row.get('start_time')
        if isinstance(start_time_val, pd.Timestamp):
            start_time_str = start_time_val.isoformat()
        else:
            start_time_str = str(start_time_val) if start_time_val is not None else ""
            
        experiments.append({
            "run_id": str(row['run_id']),
            "model_name": str(row.get('tags.model_name', 'unknown')) if pd.notna(row.get('tags.model_name')) else 'unknown',
            "dataset_id": str(row.get('tags.dataset_id', 'unknown')) if pd.notna(row.get('tags.dataset_id')) else 'unknown',
            "accuracy": float(row['metrics.accuracy']) if ('metrics.accuracy' in row and pd.notna(row['metrics.accuracy'])) else None,
            "f1_score": float(row['metrics.f1_score']) if ('metrics.f1_score' in row and pd.notna(row['metrics.f1_score'])) else None,
            "status": str(row['status']),
            "start_time": start_time_str
        })
    return clean_for_json(experiments)

def get_experiment_details(run_id: str):
    # 1. Direct MLflow run lookup
    run = None
    runs_df = None
    try:
        runs_df = mlflow_manager.search_runs()
    except Exception:
        pass

    try:
        run = mlflow_manager.get_run(run_id)
    except Exception:
        pass
        
    # 2. Search by tag if direct lookup failed
    if not run and runs_df is not None and not runs_df.empty:
        matched = runs_df[
            (runs_df['run_id'] == run_id) |
            (runs_df.get('tags.experiment_id') == run_id) |
            (runs_df.get('tags.model_id') == run_id)
        ]
        if not matched.empty:
            best_run_id = matched.sort_values(by='metrics.accuracy', ascending=False).iloc[0]['run_id']
            run = mlflow_manager.get_run(best_run_id)
            
    if not run:
        return None
        
    run_dict = run.to_dictionary()
    info = run_dict.get("info", {})
    data = run_dict.get("data", {})
    tags = data.get("tags", {})
    metrics = data.get("metrics", {})
    params = data.get("params", {})
    
    exp_id_tag = tags.get("experiment_id", "")
    dataset_id_tag = tags.get("dataset_id", "")
    
    # 3. Find all sibling models from the same training batch
    batch_models = []
    if runs_df is not None and not runs_df.empty:
        filter_mask = None
        if exp_id_tag and 'tags.experiment_id' in runs_df:
            filter_mask = (runs_df['tags.experiment_id'] == exp_id_tag)
        elif dataset_id_tag and 'tags.dataset_id' in runs_df:
            filter_mask = (runs_df['tags.dataset_id'] == dataset_id_tag)
            
        if filter_mask is not None:
            sibling_runs = runs_df[filter_mask]
            for _, s_row in sibling_runs.iterrows():
                batch_models.append({
                    "run_id": str(s_row['run_id']),
                    "model_name": str(s_row.get('tags.model_name', 'unknown')),
                    "model_id": str(s_row.get('tags.model_id', '')),
                    "accuracy": float(s_row['metrics.accuracy']) if ('metrics.accuracy' in s_row and pd.notna(s_row['metrics.accuracy'])) else None,
                    "f1_score": float(s_row['metrics.f1_score']) if ('metrics.f1_score' in s_row and pd.notna(s_row['metrics.f1_score'])) else None,
                    "status": str(s_row['status']),
                })
            # Sort by accuracy descending (champion first)
            batch_models.sort(key=lambda m: (m.get('accuracy') is not None, m.get('accuracy') or 0), reverse=True)
            
    if not batch_models:
        batch_models = [{
            "run_id": str(info.get("run_id", run_id)),
            "model_name": str(tags.get("model_name", "unknown")),
            "model_id": str(tags.get("model_id", "")),
            "accuracy": float(metrics.get("accuracy")) if metrics.get("accuracy") is not None else None,
            "f1_score": float(metrics.get("f1_score")) if metrics.get("f1_score") is not None else None,
            "status": str(info.get("status", "UNKNOWN"))
        }]
        
    champion = batch_models[0]
    champion_model_id = champion.get("model_id") or tags.get("model_id", "")
    
    # 4. Extract top 5 SHAP features for champion
    top_features = []
    if champion_model_id:
        try:
            from app.services.model_service import get_model_metadata
            meta = get_model_metadata(champion_model_id)
            f_names = meta.get("feature_names", [])
            f_importances = meta.get("feature_importance", [])
            pairs = []
            for i, name in enumerate(f_names):
                if i < len(f_importances):
                    pairs.append({"feature": name, "importance": float(f_importances[i])})
            pairs.sort(key=lambda x: x["importance"], reverse=True)
            top_features = pairs[:5]
        except Exception as e:
            print(f"Failed extracting top features: {e}")

    formatted = {
        "run_id": str(champion.get("run_id", info.get("run_id", run_id))),
        "experiment_id": exp_id_tag or info.get("experiment_id", ""),
        "model_name": champion.get("model_name", tags.get("model_name", "unknown")),
        "dataset_id": dataset_id_tag or "unknown",
        "model_id": champion_model_id,
        "accuracy": champion.get("accuracy"),
        "f1_score": champion.get("f1_score"),
        "status": champion.get("status", info.get("status", "UNKNOWN")),
        "start_time": info.get("start_time", 0),
        "end_time": info.get("end_time", 0),
        "artifact_uri": info.get("artifact_uri", ""),
        "models": batch_models,
        "top_features": top_features,
        "metrics": metrics,
        "params": params,
        "tags": tags,
        "info": info,
        "data": data
    }
    return clean_for_json(formatted)
