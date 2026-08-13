# LENS Frontend

This is the React frontend for the **Learning Explainability Navigation System (LENS)**.

## Overview
The frontend is built with React, TypeScript, and Vite. It provides a beautiful, modern UI to manage machine learning experiments, view training progress, and explain model predictions using SHAP.

### Features (UI Prototype)
- **Overview Dashboard**: A high-level view of your models and experiments.
- **Experiment History**: A table view with sorting and filtering capabilities for past experiments.
- **Training Progress**: Real-time pipeline visualization for model training.
- **Explainability Workspace**: Interactive dashboard to view global and local SHAP explanations for models.
- **Time Machine**: Compare performance shifts and feature contribution deltas across model versions.

*Note: The current frontend uses mock data for the UI prototype. It is designed to eventually connect to the LENS Python backend API.*

## Installation & Setup

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173/`.

## Styling
The project uses TailwindCSS for styling, with a custom design system centered around deep navy blues, bright teals, and soft purples. All design tokens are configured in `tailwind.config.js`.
