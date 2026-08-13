from fastapi import APIRouter, HTTPException, Body
from app.schemas.explainability import PredictionResponse
from app.services.model_service import get_model_metadata, predict_with_model, compare_models
import os
import joblib
from app.core.config import settings
from typing import Dict, Any

router = APIRouter(prefix="/api/models", tags=["Models"])

@router.get("/")
def list_models():
    models = []
    if os.path.exists(settings.MODEL_DIR):
        for f in os.listdir(settings.MODEL_DIR):
            if f.startswith("metadata_") and f.endswith(".joblib"):
                try:
                    meta = joblib.load(os.path.join(settings.MODEL_DIR, f))
                    models.append(meta)
                except:
                    pass
    return models

@router.get("/compare")
def compare_model_versions(model_id_a: str, model_id_b: str):
    try:
        return compare_models(model_id_a, model_id_b)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{model_id}")
def get_model(model_id: str):
    try:
        return get_model_metadata(model_id)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{model_id}/predict", response_model=PredictionResponse)
def predict(model_id: str, features: Dict[str, Any] = Body(...)):
    try:
        result = predict_with_model(model_id, features)
        return PredictionResponse(**result)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
