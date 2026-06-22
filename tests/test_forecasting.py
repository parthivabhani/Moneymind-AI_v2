"""
Unit tests for forecasting models.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import pytest
import numpy as np
from src.forecasting.linear_regression import OLSForecaster
from src.forecasting.random_forest import RandomForestForecaster


def test_ols_forecaster():
    X = np.arange(10).reshape(-1, 1)
    y = 2 * X.flatten() + 1 + np.random.randn(10) * 0.1
    model = OLSForecaster()
    model.fit(X, y)
    pred = model.predict(np.array([[10]]))
    assert pred[0] > 0
    assert pred[0] < 30


def test_rf_forecaster():
    X = np.arange(20).reshape(-1, 1)
    y = np.sin(X.flatten()) + np.random.randn(20) * 0.1
    model = RandomForestForecaster(n_estimators=10, max_depth=5)
    model.fit(X, y)
    pred = model.predict(np.array([[21]]))
    assert pred[0] is not None