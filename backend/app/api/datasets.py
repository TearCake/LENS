from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
import pandas as pd
from app.core.config import settings
from app.schemas.dataset import DatasetUploadResponse, DatasetResponse
from app.ml.preprocessing import analyze_dataset
from typing import List

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

@router.get("/", response_model=List[dict])
def list_datasets():
    datasets = []
    if os.path.exists(settings.UPLOAD_DIR):
        for f in os.listdir(settings.UPLOAD_DIR):
            if f.endswith(".csv"):
                dataset_id = f.replace(".csv", "")
                try:
                    # To keep it fast, we just get basic info, not full analysis
                    size_kb = round(os.path.getsize(os.path.join(settings.UPLOAD_DIR, f)) / 1024, 2)
                    datasets.append({
                        "dataset_id": dataset_id,
                        "filename": f,
                        "size_kb": size_kb
                    })
                except:
                    pass
    return datasets

@router.post("/upload", response_model=DatasetUploadResponse)
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        
    dataset_id = str(uuid.uuid4())
    file_path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}.csv")
    
    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
            
        df = pd.read_csv(file_path)
        info = analyze_dataset(df)
        
        return DatasetUploadResponse(
            dataset_id=dataset_id,
            filename=file.filename,
            **info
        )
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")

@router.get("/{dataset_id}", response_model=DatasetResponse)
def get_dataset(dataset_id: str):
    file_path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}.csv")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    try:
        df = pd.read_csv(file_path)
        info = analyze_dataset(df)
        return DatasetResponse(
            dataset_id=dataset_id,
            filename=f"{dataset_id}.csv",
            **info
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
