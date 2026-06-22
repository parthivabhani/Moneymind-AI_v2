#!/usr/bin/env python
"""
Evaluate LLM recommendation quality using expert ratings.
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
from src.evaluation.llm_quality import compute_llm_scores, krippendorff_alpha

logger = logging.getLogger(__name__)


def main(args):
    setup_logging()

    # Load ratings data: JSON with structure:
    # {"category": {"relevance": [list of scores], "specificity": [...], "coherence": [...]}}
    with open(args.ratings_path, 'r') as f:
        ratings_data = json.load(f)

    overall_ratings = {}
    for category, dim_scores in ratings_data.items():
        # Each dim_scores is a dict with dimension -> list of expert scores
        # We compute per-dimension statistics
        results = compute_llm_scores(dim_scores)
        overall_ratings[category] = results

    # Compute inter-rater reliability (Krippendorff's alpha)
    # For each category, we have multiple dimensions; we can compute alpha per dimension or overall.
    # Here we compute overall alpha across all ratings.
    all_scores_by_rater = []  # list of lists per rater across all items
    # Assume each dimension's list of scores corresponds to raters (same order)
    # We'll need to organize: for each rater, collect scores for all categories and dimensions.
    # This is a simplification; in practice, the data structure may vary.
    # For demonstration, we just compute alpha on a dummy matrix.
    # Instead, we'll compute alpha on the combined data.
    # We'll assume ratings_data contains list of scores per item per rater.
    # Better: We'll require a separate file with format: list of raters' scores per item.
    if args.raters_data:
        with open(args.raters_data, 'r') as f:
            rater_data = json.load(f)  # list of lists: rater x item
        alpha = krippendorff_alpha(rater_data)
        logger.info(f"Krippendorff's alpha: {alpha:.3f}")
    else:
        logger.warning("Rater data not provided; skipping inter-rater reliability.")

    # Save results
    output = {
        "per_category": overall_ratings,
        "overall": {
            "relevance_mean": np.mean([overall_ratings[cat]["relevance"]["mean"] for cat in overall_ratings]),
            "specificity_mean": np.mean([overall_ratings[cat]["specificity"]["mean"] for cat in overall_ratings]),
            "coherence_mean": np.mean([overall_ratings[cat]["coherence"]["mean"] for cat in overall_ratings]),
        }
    }
    if args.raters_data:
        output["krippendorff_alpha"] = alpha

    with open(args.output_json, 'w') as f:
        json.dump(output, f, indent=2)

    logger.info(f"LLM quality evaluation saved to {args.output_json}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ratings_path", required=True, help="JSON with expert ratings.")
    parser.add_argument("--raters_data", help="JSON with rater x item matrix for alpha.")
    parser.add_argument("--output_json", default="results/llm_eval.json")
    args = parser.parse_args()
    main(args)