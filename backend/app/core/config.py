import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "LENS"
    MLFLOW_TRACKING_URI: str = "sqlite:///./mlruns/mlflow.db"
    UPLOAD_DIR: str = "./data/uploads"
    PROCESSED_DIR: str = "./data/processed"
    MODEL_DIR: str = "./artifacts/models"
    SHAP_DIR: str = "./artifacts/shap"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
