from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.schemas.training import TrainingRequest, TrainingResponse
from app.services.training_service import run_training_experiment, TRAINING_JOBS, clean_for_json
import uuid

router = APIRouter(prefix="/api/training", tags=["Training"])

@router.post("/start", response_model=TrainingResponse)
def start_training(request: TrainingRequest, background_tasks: BackgroundTasks):
    experiment_id = str(uuid.uuid4())
    
    TRAINING_JOBS[experiment_id] = {
        "status": "pending",
        "progress": 0,
        "current_step": "Queued",
        "results": [],
        "error": None
    }
    
    background_tasks.add_task(
        run_training_experiment,
        experiment_id,
        request.dataset_id, 
        request.target_column, 
        request.models
    )
    
    return TrainingResponse(
        run_id=experiment_id,
        message="Training job queued successfully."
    )

@router.get("/{run_id}/status")
def get_training_status(run_id: str):
    if run_id not in TRAINING_JOBS:
        raise HTTPException(status_code=404, detail="Training job not found")
    return clean_for_json(TRAINING_JOBS[run_id])
