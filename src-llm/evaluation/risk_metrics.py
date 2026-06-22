"""
Risk classification evaluation metrics.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from typing import List, Dict

logger = logging.getLogger(__name__)


def classification_report(y_true: List[str], y_pred: List[str]) -> Dict:
    """
    Generate classification metrics per class and macro averages.

    Args:
        y_true: True labels.
        y_pred: Predicted labels.

    Returns:
        Dict with per-class precision, recall, f1, support, and macro/weighted averages.
    """
    labels = sorted(set(y_true) | set(y_pred))
    acc = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, labels=labels, average=None, zero_division=0)
    recall = recall_score(y_true, y_pred, labels=labels, average=None, zero_division=0)
    f1 = f1_score(y_true, y_pred, labels=labels, average=None, zero_division=0)
    support = [sum(1 for y in y_true if y == lab) for lab in labels]

    macro_precision = np.mean(precision)
    macro_recall = np.mean(recall)
    macro_f1 = np.mean(f1)
    weighted_f1 = f1_score(y_true, y_pred, average="weighted", zero_division=0)

    cm = confusion_matrix(y_true, y_pred, labels=labels)

    return {
        "accuracy": acc,
        "per_class": {
            lab: {"precision": p, "recall": r, "f1": f, "support": s}
            for lab, p, r, f, s in zip(labels, precision, recall, f1, support)
        },
        "macro": {"precision": macro_precision, "recall": macro_recall, "f1": macro_f1},
        "weighted": {"f1": weighted_f1},
        "confusion_matrix": cm.tolist(),
        "labels": labels
    }


def cohens_kappa(y_true: List[str], y_pred: List[str]) -> float:
    """
    Compute Cohen's kappa for inter-rater agreement.

    Args:
        y_true: True labels.
        y_pred: Predicted labels.

    Returns:
        Kappa coefficient.
    """
    from sklearn.metrics import cohen_kappa_score
    return cohen_kappa_score(y_true, y_pred)