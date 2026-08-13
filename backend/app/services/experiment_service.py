from app.mlflow_manager import mlflow_manager

def get_all_experiments():
    runs = mlflow_manager.search_runs()
    if runs is None or runs.empty:
        return []
    
    experiments = []
    for _, row in runs.iterrows():
        experiments.append({
            "run_id": row['run_id'],
            "model_name": row.get('tags.model_name', 'unknown'),
            "dataset_id": row.get('tags.dataset_id', 'unknown'),
            "accuracy": row.get('metrics.accuracy', None),
            "f1_score": row.get('metrics.f1_score', None),
            "status": row['status'],
            "start_time": row['start_time']
        })
    return experiments

def get_experiment_details(run_id: str):
    run = mlflow_manager.get_run(run_id)
    if not run:
        return None
    return run.to_dictionary()
