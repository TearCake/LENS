from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services.experiment_service import get_all_experiments, get_experiment_details
import os

router = APIRouter(prefix="/api/experiments", tags=["Experiments"])

@router.get("/")
def list_experiments():
    try:
        return get_all_experiments()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{run_id}")
def get_experiment(run_id: str):
    try:
        details = get_experiment_details(run_id)
        if not details:
            raise HTTPException(status_code=404, detail="Experiment run not found")
        return details
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.core.config import settings

@router.get("/{run_id}/artifacts/{artifact_name}")
def get_experiment_artifact(run_id: str, artifact_name: str):
    try:
        details = get_experiment_details(run_id)
        if not details:
            raise HTTPException(status_code=404, detail="Run not found")
            
        model_id = details.get("model_id", "")
        
        # 1. Check SHAP_DIR directly
        if model_id:
            direct_shap_file = os.path.join(settings.SHAP_DIR, model_id, artifact_name)
            if os.path.exists(direct_shap_file):
                return FileResponse(direct_shap_file, media_type="image/png" if artifact_name.endswith(".png") else None)
        
        # 2. Check MLflow artifact_uri
        info = details.get("info", {})
        artifact_uri = info.get("artifact_uri", "") or details.get("artifact_uri", "")
        if artifact_uri.startswith("file:///"):
            artifact_dir = artifact_uri.replace("file:///", "")
            if os.name == 'nt' and artifact_dir.startswith("/"):
                artifact_dir = artifact_dir[1:]
                
            for check_path in [
                os.path.join(artifact_dir, artifact_name),
                os.path.join(artifact_dir, "shap", artifact_name),
                os.path.join(artifact_dir, "pipeline", artifact_name),
                os.path.join(artifact_dir, "model", artifact_name),
            ]:
                if os.path.exists(check_path):
                    return FileResponse(check_path, media_type="image/png" if artifact_name.endswith(".png") else None)
                    
        # 3. Search in SHAP_DIR and MODEL_DIR
        for root_dir in [settings.SHAP_DIR, settings.MODEL_DIR]:
            if os.path.exists(root_dir):
                for r, _, files in os.walk(root_dir):
                    if artifact_name in files:
                        return FileResponse(os.path.join(r, artifact_name), media_type="image/png" if artifact_name.endswith(".png") else None)

        raise HTTPException(status_code=404, detail=f"Artifact {artifact_name} not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
