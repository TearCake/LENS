import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

def analyze_dataset(df: pd.DataFrame, target_column: str = None) -> dict:
    """Analyze the dataset to find numerical and categorical columns, skipping the target."""
    if target_column and target_column in df.columns:
        features = df.drop(columns=[target_column])
    else:
        features = df
        
    numerical_cols = features.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = features.select_dtypes(include=['object', 'category']).columns.tolist()
    
    return {
        "numerical_columns": numerical_cols,
        "categorical_columns": categorical_cols,
        "missing_value_counts": {k: int(v) for k, v in df.isnull().sum().to_dict().items()},
        "columns": df.columns.tolist(),
        "row_count": len(df),
        "column_count": len(df.columns),
        "sample_rows": df.head(5).replace({np.nan: None}).to_dict(orient="records")
    }

def create_preprocessing_pipeline(numerical_cols: list, categorical_cols: list) -> ColumnTransformer:
    """Create a scikit-learn preprocessing pipeline."""
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False, max_categories=20))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numerical_cols),
            ('cat', categorical_transformer, categorical_cols)
        ]
    )

    return preprocessor
