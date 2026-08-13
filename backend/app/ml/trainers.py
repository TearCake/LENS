from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import time

def train_logistic_regression(X_train, y_train, **kwargs):
    model = LogisticRegression(random_state=42, max_iter=1000, **kwargs)
    start_time = time.time()
    model.fit(X_train, y_train)
    training_time = time.time() - start_time
    return model, training_time, model.get_params()

def train_random_forest(X_train, y_train, **kwargs):
    model = RandomForestClassifier(random_state=42, **kwargs)
    start_time = time.time()
    model.fit(X_train, y_train)
    training_time = time.time() - start_time
    return model, training_time, model.get_params()

def train_xgboost(X_train, y_train, **kwargs):
    model = xgb.XGBClassifier(random_state=42, eval_metric='logloss', **kwargs)
    start_time = time.time()
    model.fit(X_train, y_train)
    training_time = time.time() - start_time
    return model, training_time, model.get_params()

MODEL_REGISTRY = {
    "logistic_regression": train_logistic_regression,
    "random_forest": train_random_forest,
    "xgboost": train_xgboost
}
