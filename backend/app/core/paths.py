import os
from app.core.config import settings

def ensure_directories():
    """Ensure all required directories exist based on the configuration."""
    directories = [
        settings.UPLOAD_DIR,
        settings.PROCESSED_DIR,
        settings.MODEL_DIR,
        settings.SHAP_DIR,
        "./mlruns"
    ]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
