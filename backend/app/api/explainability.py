from fastapi import APIRouter, HTTPException
from app.schemas.explainability import GlobalExplainabilityResponse
from app.services.model_service import get_model_metadata
import os
from app.core.config import settings

router = APIRouter(prefix="/api/explainability", tags=["Explainability"])

@router.get("/{model_id}/global", response_model=GlobalExplainabilityResponse)
def get_global_explanation(model_id: str):
    try:
        metadata = get_model_metadata(model_id)
        
        plot_path = ""
        shap_dir = os.path.join(settings.SHAP_DIR, model_id)
        if os.path.exists(os.path.join(shap_dir, "shap_summary.png")):
            plot_path = os.path.join(shap_dir, "shap_summary.png")
            
        return GlobalExplainabilityResponse(
            model_id=model_id,
            feature_importance={},
            summary_plot_path=plot_path
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
