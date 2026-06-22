#!/usr/bin/env python
"""
Evaluate risk classification performance.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import sys
import argparse
import logging
import json
import numpy as np
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.utils.logging import setup_logging
from src.utils.helpers import load_config
from src.risk.fhs import compute_fhs, classify_risk
from src.risk.classification import threshold_optimization
from src.evaluation.risk_metrics import classification_report, cohens_kappa

logger = logging.getLogger(__name__)


def main(args):
    setup_logging()
    config = load_config(args.config)

    # Load calibration/test data (assume JSON with list of profiles)
    with open(args.data_path, 'r') as f:
        data = json.load(f)

    # Each entry: {"fhs": ..., "risk_class": ...} or components to compute FHS
    # For evaluation, we need true labels and computed FHS.
    # If data contains components, compute FHS.
    if "components" in data[0]:
        fhs_scores = []
        for entry in data:
            fhs = compute_fhs(
                entry["components"]["net_profit_margin"],
                entry["components"]["cash_flow_stability"],
                entry["components"]["revenue_growth"],
                entry["components"]["expense_volatility"],
                weights=config['risk']['fhs_weights']
            )
            fhs_scores.append(fhs)
        true_labels = [entry["risk_class"] for entry in data]
    else:
        # Assume FHS already computed
        fhs_scores = [entry["fhs"] for entry in data]
        true_labels = [entry["risk_class"] for entry in data]

    # Use thresholds from config or optimize
    if args.optimize:
        opt = threshold_optimization(fhs_scores, true_labels)
        thresholds = (opt["high_threshold"], opt["low_threshold"])
        logger.info(f"Optimized thresholds: {thresholds}")
    else:
        thresholds = (config['risk']['thresholds']['healthy'], config['risk']['thresholds']['high_risk'])

    # Predict
    pred_labels = [classify_risk(fhs, thresholds) for fhs in fhs_scores]

    # Generate report
    report = classification_report(true_labels, pred_labels)
    kappa = cohens_kappa(true_labels, pred_labels)

    # Add thresholds info
    report["thresholds"] = {"healthy": thresholds[0], "high_risk": thresholds[1]}
    report["kappa"] = kappa

    # Save
    with open(args.output_json, 'w') as f:
        json.dump(report, f, indent=2)

    logger.info(f"Risk evaluation completed. Accuracy: {report['accuracy']:.2%}, Kappa: {kappa:.3f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_path", required=True, help="JSON file with profiles.")
    parser.add_argument("--output_json", default="results/risk_eval.json")
    parser.add_argument("--config", default="config/default.yaml")
    parser.add_argument("--optimize", action="store_true", help="Optimize thresholds on this data.")
    args = parser.parse_args()
    main(args)