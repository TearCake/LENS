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
        actual_model_id = metadata.get("model_id", model_id)
        
        plot_path = ""
        shap_dir = os.path.join(settings.SHAP_DIR, actual_model_id)
        if os.path.exists(os.path.join(shap_dir, "shap_summary.png")):
            plot_path = os.path.join(shap_dir, "shap_summary.png")
            
        feature_importance_list = metadata.get("feature_importance", [])
        feature_names = metadata.get("feature_names", [])
        
        fi_dict = {}
        for i, name in enumerate(feature_names):
            if i < len(feature_importance_list):
                fi_dict[name] = float(feature_importance_list[i])
            
        return GlobalExplainabilityResponse(
            model_id=actual_model_id,
            feature_importance=fi_dict,
            summary_plot_path=plot_path
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
