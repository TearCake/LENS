from pydantic import BaseModel
from typing import List, Dict, Any

class DatasetUploadResponse(BaseModel):
    dataset_id: str
    filename: str
    row_count: int
    column_count: int
    columns: List[str]
    numerical_columns: List[str]
    categorical_columns: List[str]
    missing_value_counts: Dict[str, int]
    sample_rows: List[Dict[str, Any]]

class DatasetResponse(DatasetUploadResponse):
    pass
