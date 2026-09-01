from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.paths import ensure_directories
from app.api import datasets, training, experiments, models, explainability, dashboard

# Ensure directories exist on startup
ensure_directories()

app = FastAPI(title=settings.APP_NAME, description="LENS Backend MVP API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(datasets.router)
app.include_router(training.router)
app.include_router(experiments.router)
app.include_router(models.router)
app.include_router(explainability.router)
app.include_router(dashboard.router)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": f"{settings.APP_NAME} backend"
    }
