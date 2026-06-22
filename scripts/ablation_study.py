#!/usr/bin/env python
"""
Ablation study on FHS components.
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
from src.risk.fhs import compute_fhs, classify_risk
from src.evaluation.risk_metrics import classification_report, cohens_kappa

logger = logging.getLogger(__name__)


def main(args):
    setup_logging()

    # Load data (profiles with components and true labels)
    with open(args.data_path, 'r') as f:
        data = json.load(f)

    # Define configurations: remove each component
    weight_configs = {
        "baseline": {"pm": 0.35, "cfs": 0.30, "rg": 0.20, "ev": 0.15},
        "no_pm": {"pm": 0.00, "cfs": 0.40, "rg": 0.30, "ev": 0.30},  # renormalized
        "no_cfs": {"pm": 0.50, "cfs": 0.00, "rg": 0.25, "ev": 0.25},
        "no_rg": {"pm": 0.42, "cfs": 0.38, "rg": 0.00, "ev": 0.20},
        "no_ev": {"pm": 0.40, "cfs": 0.35, "rg": 0.25, "ev": 0.00},
    }

    thresholds = (0.65, 0.35)
    results = {}

    for name, weights in weight_configs.items():
        preds = []
        trues = []
        for entry in data:
            fhs = compute_fhs(
                entry["components"]["net_profit_margin"],
                entry["components"]["cash_flow_stability"],
                entry["components"]["revenue_growth"],
                entry["components"]["expense_volatility"],
                weights=weights
            )
            pred = classify_risk(fhs, thresholds)
            preds.append(pred)
            trues.append(entry["risk_class"])
        report = classification_report(trues, preds)
        kappa = cohens_kappa(trues, preds)
        results[name] = {
            "accuracy": report["accuracy"],
            "macro_f1": report["macro"]["f1"],
            "kappa": kappa
        }

    # Save
    with open(args.output_json, 'w') as f:
        json.dump(results, f, indent=2)

    logger.info("Ablation study completed.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_path", required=True, help="JSON with profiles.")
    parser.add_argument("--output_json", default="results/ablation.json")
    args = parser.parse_args()
    main(args)