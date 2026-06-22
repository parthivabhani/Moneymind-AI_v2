#!/usr/bin/env python
"""
Train forecasting models using walk-forward cross-validation and save artifacts.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import sys
import os
import argparse
import logging
import pickle
import numpy as np
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.utils.logging import setup_logging
from src.utils.helpers import load_config
from src.data.ingestion import load_transactions
from src.data.preprocessing import preprocess_pipeline
from src.forecasting import OLSForecaster, RandomForestForecaster
from src.forecasting.cross_validation import walk_forward_validation
from src.evaluation.forecasting_metrics import compute_forecast_metrics

logger = logging.getLogger(__name__)


def main(args):
    setup_logging()
    config = load_config(args.config)

    # Load and preprocess
    df = load_transactions(args.data_path)
    monthly = preprocess_pipeline(df, **config['preprocessing'])

    # Target: income or expense
    target = args.target
    if target == "income":
        y = monthly['total_income'].values
    elif target == "expense":
        y = monthly['total_expense'].values
    else:
        raise ValueError("target must be 'income' or 'expense'")

    # Model selection
    model_type = args.model_type
    if model_type == "lr":
        model_class = OLSForecaster
        model_params = {}
    elif model_type == "rf":
        model_class = RandomForestForecaster
        model_params = config['forecasting']['random_forest']
    else:
        raise ValueError("model_type must be 'lr' or 'rf'")

    # Walk-forward validation
    cv_config = config['forecasting']['walk_forward']
    cv_results = walk_forward_validation(
        y=y,
        model_class=model_class,
        model_params=model_params,
        initial_window=cv_config['initial_window'],
        step_size=cv_config['step_size'],
        test_horizon=cv_config['test_horizon']
    )

    logger.info(f"Training complete. MAPE: {cv_results['macro_averages']['MAPE']:.2f}%")

    # Save results
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Save CV results
    cv_path = output_dir / f"cv_results_{model_type}.json"
    import json
    with open(cv_path, 'w') as f:
        json.dump(cv_results, f, indent=2)

    # Train final model on all data for inference
    X_all = np.arange(len(y)).reshape(-1, 1)
    final_model = model_class(**model_params)
    final_model.fit(X_all, y)

    model_path = output_dir / f"{model_type}_model.pkl"
    with open(model_path, 'wb') as f:
        pickle.dump(final_model, f)
    logger.info(f"Final model saved to {model_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_path", required=True, help="Path to CSV transactions.")
    parser.add_argument("--target", default="income", choices=["income", "expense"])
    parser.add_argument("--model_type", default="rf", choices=["lr", "rf"])
    parser.add_argument("--output_dir", default="models", help="Directory to save models and results.")
    parser.add_argument("--config", default="config/default.yaml")
    args = parser.parse_args()
    main(args)