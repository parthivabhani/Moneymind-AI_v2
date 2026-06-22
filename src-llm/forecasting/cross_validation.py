"""
Walk-forward cross-validation for time-series forecasting.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import numpy as np
from typing import List, Tuple, Dict, Any
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

logger = logging.getLogger(__name__)


def walk_forward_validation(
    y: np.ndarray,
    model_class,
    model_params: Dict[str, Any],
    initial_window: int = 12,
    step_size: int = 1,
    test_horizon: int = 3,
    forecast_horizons: List[int] = [30, 60, 90]
) -> Dict[str, Any]:
    """
    Perform walk-forward cross-validation.

    Args:
        y: 1D array of monthly observations (income or expense).
        model_class: Class of the forecasting model (e.g., OLSForecaster or RandomForestForecaster).
        model_params: Parameters to instantiate the model.
        initial_window: Number of initial months for training.
        step_size: Step size for moving the test window forward.
        test_horizon: Number of months to forecast ahead (test window size).
        forecast_horizons: List of horizons in days (used for reporting; not directly used here).

    Returns:
        Dictionary containing:
            - fold_metrics: List of per-fold metric dicts.
            - macro_averages: Dict with mean and std of each metric.
            - confidence_intervals: 95% CI for each metric.
            - predictions: List of forecasted values per fold.
    """
    n = len(y)
    if n < initial_window + test_horizon:
        raise ValueError("Insufficient data for walk-forward validation.")

    # Compute number of folds K
    K = (n - initial_window - test_horizon) // step_size + 1
    logger.info(f"Performing walk-forward validation with K={K} folds.")

    fold_metrics = []
    fold_predictions = []
    fold_actuals = []

    for k in range(K):
        train_start = 0
        train_end = initial_window + k * step_size
        test_start = train_end
        test_end = min(n, train_end + test_horizon)

        X_train = np.arange(train_start, train_end).reshape(-1, 1)
        y_train = y[train_start:train_end]
        X_test = np.arange(test_start, test_end).reshape(-1, 1)
        y_test = y[test_start:test_end]

        # Train model
        model = model_class(**model_params)
        model.fit(X_train, y_train)

        # Predict
        y_pred = model.predict(X_test)

        # Compute metrics
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        # MAPE
        mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100 if (y_test != 0).all() else np.inf
        r2 = r2_score(y_test, y_pred)

        fold_metrics.append({"MAE": mae, "RMSE": rmse, "MAPE": mape, "R2": r2})
        fold_predictions.append(y_pred.tolist())
        fold_actuals.append(y_test.tolist())

        logger.debug(f"Fold {k+1}/{K}: MAE={mae:.2f}, MAPE={mape:.2f}%, R2={r2:.3f}")

    # Aggregate metrics
    metric_keys = ["MAE", "RMSE", "MAPE", "R2"]
    means = {}
    stds = {}
    cis = {}
    for key in metric_keys:
        values = [m[key] for m in fold_metrics]
        means[key] = np.mean(values)
        stds[key] = np.std(values, ddof=1) if len(values) > 1 else 0.0
        # 95% CI
        z = 1.96
        ci = z * stds[key] / np.sqrt(len(values))
        cis[key] = (means[key] - ci, means[key] + ci)

    logger.info(f"Macro averages: MAPE={means['MAPE']:.2f}% (±{stds['MAPE']:.2f})")
    return {
        "fold_metrics": fold_metrics,
        "macro_averages": means,
        "standard_deviations": stds,
        "confidence_intervals": cis,
        "predictions": fold_predictions,
        "actuals": fold_actuals,
        "K": K
    }