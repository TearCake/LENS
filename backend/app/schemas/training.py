from pydantic import BaseModel
from typing import List

class TrainingRequest(BaseModel):
    dataset_id: str
    target_column: str
    models: List[str] = ["logistic_regression", "random_forest", "xgboost"]

class TrainingResponse(BaseModel):
    run_id: str
    message: str
