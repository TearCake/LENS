const API_BASE = 'http://localhost:8000/api';

export interface DashboardStats {
  metrics: {
    total_models: number;
    active_experiments: number;
    success_rate: number;
    api_requests_today: number;
  };
  health: {
    backend: string;
    mlflow: string;
    storage_used_mb: number;
  };
}

export interface Dataset {
  dataset_id: string;
  filename: string;
  size_kb: number;
}

export interface DatasetDetails extends Dataset {
  row_count: number;
  column_count: number;
  columns: string[];
  numerical_columns: string[];
  categorical_columns: string[];
  missing_value_counts: Record<string, number>;
  sample_rows: Record<string, any>[];
}

export interface Experiment {
  run_id: string;
  model_name: string;
  dataset_id: string;
  accuracy: number | null;
  f1_score: number | null;
  status: string;
  start_time: number;
  model_id?: string;
  models?: {
    run_id: string;
    model_name: string;
    model_id: string;
    accuracy: number | null;
    f1_score: number | null;
    status: string;
  }[];
  top_features?: {
    feature: string;
    importance: number;
  }[];
}

export interface TrainingStatus {
  status: string;
  progress: number;
  current_step: string;
  results: any[];
  error: string | null;
}

export interface GlobalExplainability {
  model_id: string;
  feature_importance: Record<string, number>;
  summary_plot_path: string;
}

export interface ModelComparison {
  model: string;
  version_a: any;
  version_b: any;
  performance_delta: Record<string, number>;
  feature_contribution_delta: {
    feature: string;
    delta: number;
    baseline: number;
    comparison: number;
  }[];
}

export const api = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // Datasets
  getDatasets: async (): Promise<Dataset[]> => {
    const res = await fetch(`${API_BASE}/datasets/`);
    if (!res.ok) throw new Error('Failed to fetch datasets');
    return res.json();
  },

  getDatasetDetails: async (datasetId: string): Promise<DatasetDetails> => {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}`);
    if (!res.ok) throw new Error('Failed to fetch dataset details');
    return res.json();
  },

  uploadDataset: async (file: File): Promise<DatasetDetails> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/datasets/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to upload dataset');
    }
    return res.json();
  },

  // Training
  startTraining: async (datasetId: string, targetColumn: string, models: string[]): Promise<{run_id: string, message: string}> => {
    const res = await fetch(`${API_BASE}/training/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataset_id: datasetId, target_column: targetColumn, models })
    });
    if (!res.ok) throw new Error('Failed to start training');
    return res.json();
  },
  
  getTrainingStatus: async (runId: string): Promise<TrainingStatus> => {
    const res = await fetch(`${API_BASE}/training/${runId}/status`);
    if (!res.ok) throw new Error('Failed to fetch training status');
    return res.json();
  },

  // Experiments
  getExperiments: async (): Promise<Experiment[]> => {
    const res = await fetch(`${API_BASE}/experiments/`);
    if (!res.ok) throw new Error('Failed to fetch experiments');
    return res.json();
  },

  getExperimentDetails: async (runId: string): Promise<any> => {
    const res = await fetch(`${API_BASE}/experiments/${runId}`);
    if (!res.ok) throw new Error('Failed to fetch experiment details');
    return res.json();
  },

  // Explainability
  getGlobalExplainability: async (modelId: string): Promise<GlobalExplainability> => {
    const res = await fetch(`${API_BASE}/explainability/${modelId}/global`);
    if (!res.ok) throw new Error('Failed to fetch global explainability');
    return res.json();
  },

  // Models
  getModels: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE}/models/`);
    if (!res.ok) throw new Error('Failed to fetch models');
    return res.json();
  },

  compareModels: async (modelA: string, modelB: string): Promise<ModelComparison> => {
    const res = await fetch(`${API_BASE}/models/compare?model_id_a=${modelA}&model_id_b=${modelB}`);
    if (!res.ok) throw new Error('Failed to compare models');
    return res.json();
  },

  predict: async (modelId: string, features: Record<string, any>): Promise<any> => {
    const res = await fetch(`${API_BASE}/models/${modelId}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features)
    });
    if (!res.ok) throw new Error('Failed to predict');
    return res.json();
  }
};
