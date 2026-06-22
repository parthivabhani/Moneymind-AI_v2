"""
Random Forest forecaster with hyperparameter configuration.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class RandomForestForecaster:
    """
    Random Forest ensemble model for financial forecasting.

    Attributes:
        model: sklearn RandomForestRegressor instance.
        n_estimators: Number of trees.
        max_depth: Maximum tree depth.
        random_state: Seed for reproducibility.
    """

    def __init__(
        self,
        n_estimators: int = 100,
        max_depth: int = 12,
        min_samples_split: int = 2,
        min_samples_leaf: int = 1,
        random_state: int = 42
    ):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.random_state = random_state
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            min_samples_leaf=min_samples_leaf,
            random_state=random_state,
            oob_score=True,
            n_jobs=-1
        )
        self.is_fitted = False

    def fit(self, X: np.ndarray, y: np.ndarray) -> None:
        """
        Fit Random Forest model.

        Args:
            X: Feature matrix (time index, shape (n_samples, 1)).
            y: Target values.
        """
        if X.ndim == 1:
            X = X.reshape(-1, 1)
        self.model.fit(X, y)
        self.is_fitted = True
        logger.info(f"RF fitted with {self.n_estimators} trees, depth {self.max_depth}, OOB score={self.model.oob_score_:.4f}")

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Generate predictions.

        Args:
            X: Feature matrix.

        Returns:
            Predicted values.
        """
        if not self.is_fitted:
            raise RuntimeError("Model not fitted.")
        if X.ndim == 1:
            X = X.reshape(-1, 1)
        return self.model.predict(X)

    def evaluate(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        """
        Evaluate model performance.

        Args:
            X: Features.
            y: True values.

        Returns:
            Dictionary with MAE, RMSE, MAPE, R².
        """
        y_pred = self.predict(X)
        mae = mean_absolute_error(y, y_pred)
        rmse = np.sqrt(mean_squared_error(y, y_pred))
        mape = np.mean(np.abs((y - y_pred) / y)) * 100 if (y != 0).all() else np.inf
        r2 = r2_score(y, y_pred)
        return {"MAE": mae, "RMSE": rmse, "MAPE": mape, "R2": r2}