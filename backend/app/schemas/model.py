from pydantic import BaseModel
from typing import Dict, Any, List

class ModelMetadata(BaseModel):
    model_id: str
    model_name: str
    version: str
    accuracy: float
    f1: float
    precision: float
    recall: float
    created_at: str
    mlflow_run_id: str
    status: str

class ModelComparison(BaseModel):
    model: str
    version_a: ModelMetadata
    version_b: ModelMetadata
    performance_delta: Dict[str, float]
    prediction_shift: Dict[str, Any]
    feature_contribution_delta: List[Dict[str, Any]]
