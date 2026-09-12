import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

def clean_dataset(df: pd.DataFrame, target_column: str = None) -> pd.DataFrame:
    """Clean dataset by converting columns that are mostly numeric (e.g. TotalCharges) from object to float."""
    df_clean = df.copy()
    for col in df_clean.columns:
        if col != target_column and df_clean[col].dtype == 'object':
            converted = pd.to_numeric(df_clean[col], errors='coerce')
            if len(df_clean) > 0 and (converted.notnull().sum() / len(df_clean)) > 0.8 and converted.nunique() > 10:
                df_clean[col] = converted
    return df_clean

def analyze_dataset(df: pd.DataFrame, target_column: str = None) -> dict:
    """Analyze the dataset to find numerical and categorical columns, skipping the target."""
    df_clean = clean_dataset(df, target_column)
    
    # Exclude target and identifier columns from feature sets
    id_cols = [c for c in df_clean.columns if c != target_column and (
        c.lower().strip() in ['id', 'customerid', 'user_id', 'client_id', 'row_id', 'uuid', 'guid'] or
        (df_clean[c].dtype == 'object' and len(df_clean) > 50 and df_clean[c].nunique() / len(df_clean) > 0.95)
    )]
    cols_to_drop = [c for c in ([target_column] + id_cols) if c and c in df_clean.columns]
    features = df_clean.drop(columns=cols_to_drop)
        
    numerical_cols = features.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = features.select_dtypes(include=['object', 'category']).columns.tolist()
    
    return {
        "numerical_columns": numerical_cols,
        "categorical_columns": categorical_cols,
        "id_columns": id_cols,
        "missing_value_counts": {k: int(v) for k, v in df_clean.isnull().sum().to_dict().items()},
        "columns": df_clean.columns.tolist(),
        "row_count": len(df_clean),
        "column_count": len(df_clean.columns),
        "sample_rows": df_clean.head(5).replace({np.nan: None}).to_dict(orient="records")
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
