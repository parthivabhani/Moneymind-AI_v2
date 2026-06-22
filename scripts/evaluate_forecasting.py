#!/usr/bin/env python
"""
Evaluate forecasting models on hold-out data and create performance plots.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import sys
import os
import argparse
import logging
import pickle
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.utils.logging import setup_logging
from src.utils.helpers import load_config
from src.data.ingestion import load_transactions
from src.data.preprocessing import preprocess_pipeline
from src.forecasting import OLSForecaster, RandomForestForecaster
from src.evaluation.forecasting_metrics import compute_forecast_metrics, diebold_mariano_test

logger = logging.getLogger(__name__)


def main(args):
    setup_logging()
    config = load_config(args.config)

    # Load test data (preprocessed monthly)
    # For simplicity, we use the entire dataset split by time
    df = load_transactions(args.data_path)
    monthly = preprocess_pipeline(df, **config['preprocessing'])
    y = monthly['total_income'].values if args.target == "income" else monthly['total_expense'].values

    # Split: last 3 months for test
    train_size = len(y) - 3
    y_train = y[:train_size]
    y_test = y[train_size:]

    # Load models
    model_lr = None
    model_rf = None
    if args.model_lr_path:
        with open(args.model_lr_path, 'rb') as f:
            model_lr = pickle.load(f)
    if args.model_rf_path:
        with open(args.model_rf_path, 'rb') as f:
            model_rf = pickle.load(f)

    # Prepare features for test
    X_test = np.arange(train_size, len(y)).reshape(-1, 1)

    results = {}
    if model_lr is not None:
        y_pred_lr = model_lr.predict(X_test)
        metrics_lr = compute_forecast_metrics(y_test, y_pred_lr)
        results["lr"] = metrics_lr
    if model_rf is not None:
        y_pred_rf = model_rf.predict(X_test)
        metrics_rf = compute_forecast_metrics(y_test, y_pred_rf)
        results["rf"] = metrics_rf

    # DM test if both models present
    if model_lr is not None and model_rf is not None:
        dm = diebold_mariano_test(y_test, y_pred_lr, y_pred_rf, h=1)
        results["dm_test"] = dm
        logger.info(f"DM test: statistic={dm['DM_statistic']:.3f}, p={dm['p_value']:.4f}")

    # Print results
    for model, metrics in results.items():
        if model == "dm_test":
            continue
        logger.info(f"{model.upper()} Test Metrics: MAE={metrics['MAE']:.2f}, MAPE={metrics['MAPE']:.2f}%, R2={metrics['R2']:.3f}")

    # Plot predictions vs actuals
    plt.figure(figsize=(10, 6))
    plt.plot(range(len(y)), y, label='Actual', marker='o')
    if model_lr is not None:
        plt.plot(range(train_size, len(y)), y_pred_lr, '--', label='LR Forecast')
    if model_rf is not None:
        plt.plot(range(train_size, len(y)), y_pred_rf, '--', label='RF Forecast')
    plt.xlabel('Time Index')
    plt.ylabel('Amount')
    plt.title('Forecasting Performance on Hold-out Period')
    plt.legend()
    plt.grid(True)
    plt.savefig(args.plot_output)
    logger.info(f"Plot saved to {args.plot_output}")

    # Save results
    import json
    with open(args.output_json, 'w') as f:
        json.dump(results, f, indent=2)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_path", required=True)
    parser.add_argument("--target", default="income", choices=["income", "expense"])
    parser.add_argument("--model_lr_path", help="Path to LR model pkl")
    parser.add_argument("--model_rf_path", help="Path to RF model pkl")
    parser.add_argument("--output_json", default="results/forecast_eval.json")
    parser.add_argument("--plot_output", default="results/forecast_plot.png")
    parser.add_argument("--config", default="config/default.yaml")
    args = parser.parse_args()
    main(args)
