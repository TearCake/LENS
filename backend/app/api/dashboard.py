from fastapi import APIRouter
from app.services.experiment_service import get_all_experiments
import os
from app.core.config import settings

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats():
    experiments = get_all_experiments()
    total_experiments = len(experiments)
    
    # Calculate success rate
    completed = [e for e in experiments if e["status"] == "FINISHED"]
    failed = [e for e in experiments if e["status"] == "FAILED"]
    running = [e for e in experiments if e["status"] == "RUNNING"]
    
    success_rate = 0
    if (len(completed) + len(failed)) > 0:
        success_rate = round((len(completed) / (len(completed) + len(failed))) * 100)
    elif total_experiments == 0:
        success_rate = 100
        
    # Check MLFlow health
    mlflow_status = "offline"
    try:
        db_path = "./mlruns/mlflow.db"
        if os.path.exists(db_path):
            mlflow_status = "online"
    except:
        pass
        
    # Calculate storage
    storage_used_mb = 0
    try:
        def get_size(start_path = '.'):
            total_size = 0
            for dirpath, dirnames, filenames in os.walk(start_path):
                for f in filenames:
                    fp = os.path.join(dirpath, f)
                    if not os.path.islink(fp):
                        total_size += os.path.getsize(fp)
            return total_size
            
        artifacts_size = get_size(settings.ARTIFACTS_DIR) if os.path.exists(settings.ARTIFACTS_DIR) else 0
        data_size = get_size(settings.UPLOAD_DIR) if os.path.exists(settings.UPLOAD_DIR) else 0
        mlruns_size = get_size('./mlruns') if os.path.exists('./mlruns') else 0
        
        storage_used_mb = round((artifacts_size + data_size + mlruns_size) / (1024 * 1024), 2)
    except:
        pass

    return {
        "metrics": {
            "total_models": len(completed),
            "active_experiments": len(running),
            "success_rate": success_rate,
            "api_requests_today": 42 # Mock
        },
        "health": {
            "backend": "online",
            "mlflow": mlflow_status,
            "storage_used_mb": storage_used_mb
        }
    }
