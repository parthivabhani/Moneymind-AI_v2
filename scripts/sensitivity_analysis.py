#!/usr/bin/env python
"""
Sensitivity analysis for FHS weight perturbation.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import sys
import argparse
import json
import numpy as np
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.risk.fhs import compute_fhs, classify_risk
from src.evaluation.risk_metrics import classification_report

def main(args):
    with open(args.profiles_path, 'r') as f:
        data = json.load(f)
    
    # Baseline weights
    baseline = {"pm": 0.35, "cfs": 0.30, "rg": 0.20, "ev": 0.15}
    thresholds = (0.65, 0.35)
    
    results = {}
    # Baseline
    preds = []
    trues = []
    for entry in data:
        comp = entry["components"]
        fhs = compute_fhs(comp["net_profit_margin"], comp["cash_flow_stability"],
                          comp["revenue_growth"], comp["expense_volatility"], baseline)
        preds.append(classify_risk(fhs, thresholds))
        trues.append(entry["risk_class"])
    report = classification_report(trues, preds)
    results["baseline"] = {"accuracy": report["accuracy"], "macro_f1": report["macro"]["f1"]}
    
    # Perturb each weight by ±20%
    components = ["pm", "cfs", "rg", "ev"]
    for comp in components:
        for delta in [0.2, -0.2]:
            weights = baseline.copy()
            weights[comp] = baseline[comp] * (1 + delta)
            # renormalize
            total = sum(weights.values())
            weights = {k: v/total for k, v in weights.items()}
            preds = []
            for entry in data:
                comp_vals = entry["components"]
                fhs = compute_fhs(comp_vals["net_profit_margin"], comp_vals["cash_flow_stability"],
                                  comp_vals["revenue_growth"], comp_vals["expense_volatility"], weights)
                preds.append(classify_risk(fhs, thresholds))
                trues = [entry["risk_class"] for entry in data]  # reuse
            report = classification_report(trues, preds)
            key = f"{comp}_{int(delta*100)}%"
            results[key] = {"accuracy": report["accuracy"], "macro_f1": report["macro"]["f1"], "weights": weights}
    
    # Save
    with open(args.output_json, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"Sensitivity analysis results saved to {args.output_json}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--profiles_path", default="data/calibration/profiles.json")
    parser.add_argument("--output_json", default="results/sensitivity.json")
    args = parser.parse_args()
    main(args)