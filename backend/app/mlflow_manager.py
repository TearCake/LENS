import mlflow
import os
from app.core.config import settings
from typing import Dict, Any, Optional

class MLflowManager:
    def __init__(self):
        mlflow.set_tracking_uri(settings.MLFLOW_TRACKING_URI)
        self.experiment_name = "LENS Experiments"
        self._ensure_experiment()

    def _ensure_experiment(self):
        exp = mlflow.get_experiment_by_name(self.experiment_name)
        if not exp:
            mlflow.create_experiment(self.experiment_name)
        mlflow.set_experiment(self.experiment_name)

    def start_run(self, run_name: str) -> mlflow.ActiveRun:
        return mlflow.start_run(run_name=run_name)

    def log_params(self, params: Dict[str, Any]):
        mlflow.log_params(params)

    def log_metrics(self, metrics: Dict[str, float]):
        mlflow.log_metrics(metrics)

    def log_tags(self, tags: Dict[str, str]):
        mlflow.set_tags(tags)

    def log_artifact(self, local_path: str, artifact_path: Optional[str] = None):
        mlflow.log_artifact(local_path, artifact_path)
        
    def log_model(self, model, artifact_path: str):
        mlflow.sklearn.log_model(model, artifact_path)

    def get_run(self, run_id: str):
        return mlflow.get_run(run_id)

    def search_runs(self, experiment_id: Optional[str] = None):
        if not experiment_id:
            exp = mlflow.get_experiment_by_name(self.experiment_name)
            if exp:
                experiment_id = exp.experiment_id
        if experiment_id:
            return mlflow.search_runs(experiment_ids=[experiment_id])
        return None

mlflow_manager = MLflowManager()
