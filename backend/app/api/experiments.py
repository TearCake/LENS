from fastapi import APIRouter, HTTPException
from app.services.experiment_service import get_all_experiments, get_experiment_details

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
