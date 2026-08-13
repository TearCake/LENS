from fastapi import APIRouter, HTTPException
from app.schemas.training import TrainingRequest, TrainingResponse
from app.services.training_service import run_training_experiment

router = APIRouter(prefix="/api/training", tags=["Training"])

@router.post("/start", response_model=TrainingResponse)
def start_training(request: TrainingRequest):
    try:
        result = run_training_experiment(
            request.dataset_id, 
            request.target_column, 
            request.models
        )
        return TrainingResponse(
            run_id=result["experiment_id"],
            message="Training completed successfully."
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")
