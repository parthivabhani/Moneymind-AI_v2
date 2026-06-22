"""
Optimization of risk classification thresholds using grid search.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import numpy as np
from sklearn.metrics import f1_score
from typing import List, Tuple, Dict
from .fhs import classify_risk

logger = logging.getLogger(__name__)


def threshold_optimization(
    fhs_scores: List[float],
    true_labels: List[str],
    search_high: List[float] = None,
    search_low: List[float] = None
) -> Dict[str, float]:
    """
    Perform grid search to find optimal thresholds maximizing macro F1.

    Args:
        fhs_scores: List of FHS scores.
        true_labels: List of true risk classes.
        search_high: List of candidate high thresholds. Default [0.50, 0.55, ..., 0.80].
        search_low: List of candidate low thresholds. Default [0.20, 0.25, ..., 0.40].

    Returns:
        Dict with optimal thresholds and best F1.
    """
    if search_high is None:
        search_high = np.arange(0.50, 0.81, 0.05).tolist()
    if search_low is None:
        search_low = np.arange(0.20, 0.41, 0.05).tolist()

    best_f1 = -1.0
    best_thresholds = (0.65, 0.35)
    label_mapping = {"Healthy": 0, "Moderate Risk": 1, "High Risk": 2}

    for tau_h in search_high:
        for tau_l in search_low:
            if tau_l >= tau_h:
                continue
            predictions = [classify_risk(fhs, (tau_h, tau_l)) for fhs in fhs_scores]
            # Compute macro F1
            f1_macro = f1_score(
                [label_mapping[lab] for lab in true_labels],
                [label_mapping[pred] for pred in predictions],
                average="macro"
            )
            if f1_macro > best_f1:
                best_f1 = f1_macro
                best_thresholds = (tau_h, tau_l)

    logger.info(f"Optimal thresholds: high={best_thresholds[0]:.2f}, low={best_thresholds[1]:.2f}, macro F1={best_f1:.3f}")
    return {"high_threshold": best_thresholds[0], "low_threshold": best_thresholds[1], "best_f1": best_f1}