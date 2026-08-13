# LENS (Learning Explainability Navigation System)

LENS is a powerful Explainable AI (XAI) and MLOps platform designed to simplify the process of training machine learning models and understanding their predictions.

The platform provides an end-to-end workflow:
1. **Upload Datasets**: Automatically validate and preprocess tabular data.
2. **Train Models**: Train multiple architectures (XGBoost, Random Forest, Logistic Regression) simultaneously.
3. **Track Experiments**: Automatically log hyperparameters, metrics, and models using MLflow.
4. **Explain Predictions**: Generate global feature importance and local predictions using SHAP (SHapley Additive exPlanations).

## Project Structure

This repository is organized into two main components:

- **[`/frontend`](./frontend/)**: A modern, interactive React + TypeScript UI built with Vite and TailwindCSS.
- **[`/backend`](./backend/)**: A robust Python FastAPI backend integrated with Scikit-learn, XGBoost, SHAP, and MLflow.

Please refer to the individual `README.md` files in each directory for specific setup and installation instructions:
- [Frontend Setup Guide](./frontend/README.md)
- [Backend Setup Guide](./backend/README.md)

## Quick Start
To run the full stack locally:

1. **Start the Backend APIs**:
   ```bash
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   fastapi dev app/main.py
   ```

2. **Start the MLflow Tracking Server**:
   ```bash
   # In a new terminal
   cd backend
   .\.venv\Scripts\activate
   mlflow ui --backend-store-uri sqlite:///./mlruns/mlflow.db
   ```

3. **Start the Frontend UI**:
   ```bash
   # In a new terminal
   cd frontend
   npm install
   npm run dev
   ```

Visit `http://localhost:5173` to access the LENS UI!
