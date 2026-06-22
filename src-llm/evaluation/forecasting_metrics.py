"""
Forecasting evaluation metrics and statistical tests.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)


def compute_forecast_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Compute standard forecasting metrics.

    Args:
        y_true: Ground truth.
        y_pred: Predictions.

    Returns:
        Dict with MAE, RMSE, MAPE, R².
    """
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100 if (y_true != 0).all() else np.inf
    r2 = r2_score(y_true, y_pred)
    return {"MAE": mae, "RMSE": rmse, "MAPE": mape, "R2": r2}


def diebold_mariano_test(
    y_true: np.ndarray,
    pred1: np.ndarray,
    pred2: np.ndarray,
    h: int = 1,
    loss_func: str = "squared"
) -> Dict[str, float]:
    """
    Perform Diebold-Mariano test for comparing predictive accuracy.

    Args:
        y_true: Actual observations.
        pred1: Forecasts from model 1.
        pred2: Forecasts from model 2.
        h: Forecast horizon (for autocorrelation adjustment).
        loss_func: "squared" or "absolute".

    Returns:
        Dict with DM statistic and p-value (two-sided normal approximation).
    """
    n = len(y_true)
    if loss_func == "squared":
        loss1 = (y_true - pred1) ** 2
        loss2 = (y_true - pred2) ** 2
    else:
        loss1 = np.abs(y_true - pred1)
        loss2 = np.abs(y_true - pred2)

    d = loss1 - loss2
    d_bar = np.mean(d)

    # Compute variance with autocorrelation adjustment
    # For h=1, just use standard error.
    # For h>1, we should account for autocorrelation up to h-1.
    var_d = np.var(d, ddof=1)
    if h > 1:
        # Estimate autocovariance
        gamma = []
        for k in range(1, h):
            gamma.append(np.mean((d[k:] - d_bar) * (d[:-k] - d_bar)))
        var_d = var_d + 2 * np.sum(gamma) / n
    dm_stat = d_bar / np.sqrt(var_d / n)
    # Two-sided p-value
    from scipy.stats import norm
    p_value = 2 * (1 - norm.cdf(abs(dm_stat)))
    return {"DM_statistic": dm_stat, "p_value": p_value}