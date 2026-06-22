"""
Evaluation of LLM recommendation quality using expert ratings.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import numpy as np
from typing import List, Dict

logger = logging.getLogger(__name__)


def compute_llm_scores(ratings: Dict[str, List[float]]) -> Dict:
    """
    Compute mean and standard deviation of recommendation quality dimensions.

    Args:
        ratings: Dict mapping dimension (e.g., 'relevance') to list of expert scores.

    Returns:
        Dict with mean, std per dimension, and overall mean.
    """
    results = {}
    all_scores = []
    for dim, scores in ratings.items():
        mean_val = np.mean(scores)
        std_val = np.std(scores, ddof=1) if len(scores) > 1 else 0.0
        results[dim] = {"mean": mean_val, "std": std_val}
        all_scores.extend(scores)
    results["overall"] = {"mean": np.mean(all_scores), "std": np.std(all_scores, ddof=1) if len(all_scores) > 1 else 0.0}
    return results


def krippendorff_alpha(data: List[List[float]]) -> float:
    """
    Compute Krippendorff's alpha for inter-rater reliability.

    Args:
        data: List of raters' scores (each rater's list of evaluations per item).

    Returns:
        Alpha coefficient.
    """
    from krippendorff import alpha
    # Convert to numpy array and ensure shape (raters, items)
    data_np = np.array(data)
    if data_np.ndim == 1:
        data_np = data_np.reshape(1, -1)
    # Use nominal metric (scores on Likert scale)
    return alpha(data_np, level_of_measurement="ordinal")