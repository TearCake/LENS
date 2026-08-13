from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ExperimentResult(BaseModel):
    model_id: str
    run_id: str
    model_name: str
    model_version: str
    dataset_id: str
    parameters: Dict[str, Any]
    metrics: Dict[str, float]
    training_time: float
    artifact_paths: Dict[str, str]

class ExperimentResponse(BaseModel):
    experiment_id: str
    results: List[ExperimentResult]
    best_model_id: Optional[str] = None
