from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class FeatureContribution(BaseModel):
    feature: str
    shap_value: float
    direction: str

class PredictionResponse(BaseModel):
    prediction: Any
    predicted_label: Optional[str] = None
    probability: float
    base_value: float
    feature_contributions: List[FeatureContribution]
    model_id: str
    model_version: str

class GlobalExplainabilityResponse(BaseModel):
    model_id: str
    feature_importance: Dict[str, float]
    summary_plot_path: str
