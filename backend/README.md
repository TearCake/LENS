# LENS Backend MVP

This is the standalone backend for the Learning Explainability Navigation System (LENS).

## 1. Backend Architecture
The backend is built with FastAPI and Scikit-learn, featuring a clean architecture separating API routing, core business logic, and Machine Learning operations. It integrates MLflow for tracking experiments and SHAP for model explainability.

## 2. Installation & Setup

1. **Virtual Environment Setup:**
   Navigate to the `backend` folder and create a virtual environment:
   ```bash
   python -m venv .venv
   ```

2. **Activate the Virtual Environment:**
   - **Windows:** `.venv\Scripts\activate`
   - **macOS/Linux:** `source .venv/bin/activate`

3. **Install Requirements:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Copy `.env.example` to `.env` (the defaults are usually fine for local dev).

## 3. Running the Services

### Start FastAPI
To start the FastAPI development server:
```bash
fastapi dev app/main.py
```
Or with uvicorn directly:
```bash
uvicorn app.main:app --reload
```
The API documentation (Swagger UI) will be available at: http://localhost:8000/docs

### Start MLflow
To view your experiments, start the MLflow tracking server:
```bash
mlflow ui --backend-store-uri sqlite:///./mlruns/mlflow.db
```
The MLflow UI will be available at: http://localhost:5000

## 4. Key Concepts

- **MLflow Tracking**: All models are trained as part of an experiment run. Parameters (like model type and target column), metrics (accuracy, F1), and artifacts (model file, SHAP plots) are stored in the local SQLite database at `./mlruns/mlflow.db`.
- **SHAP**: SHAP explains predictions. When a model is trained, global SHAP feature importance is generated and saved as an artifact. We provide local explanations for individual predictions.

## 5. API Workflow Example

1. **Upload Dataset**: `POST /api/datasets/upload` (Upload a CSV file)
2. **Start Training**: `POST /api/training/start` (Pass the `dataset_id` and `target_column` to train models)
3. **View Experiments**: `GET /api/experiments` (Check the MLflow logged experiments)
4. **Predict**: `POST /api/models/{model_id}/predict` (Make a prediction and get local SHAP explanation)

## 6. Running the Test Pipeline

To verify the pipeline works locally without making API requests, run:
```bash
python scripts/test_pipeline.py
```
This loads a sample dataset, trains the supported models, logs them to MLflow, and generates SHAP outputs.

## 7. Frontend Integration

A React frontend is available in the `../frontend` directory. It is currently built as a UI prototype with mock data, but the backend provides all necessary REST API endpoints (`app/api/`) to support full end-to-end integration.
