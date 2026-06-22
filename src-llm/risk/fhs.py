"""
Financial Health Score (FHS) computation and risk classification.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import numpy as np
from typing import Dict, Tuple

logger = logging.getLogger(__name__)


def compute_fhs(
    net_profit_margin: float,
    cash_flow_stability: float,
    revenue_growth: float,
    expense_volatility: float,
    weights: Dict[str, float] = None
) -> float:
    """
    Compute the composite Financial Health Score.

    Args:
        net_profit_margin: NPM as percentage (e.g., 15.0 for 15%).
        cash_flow_stability: CFS = 1 - CoV(NCF), between 0 and 1.
        revenue_growth: Normalised revenue growth (0 to 1).
        expense_volatility: Normalised expense volatility (0 to 1).
        weights: Dict with keys 'pm', 'cfs', 'rg', 'ev'. If None, use default.

    Returns:
        FHS score in [0, 1].
    """
    if weights is None:
        weights = {"pm": 0.35, "cfs": 0.30, "rg": 0.20, "ev": 0.15}
    # Normalise PM to [0,1] assuming NPM is between 0 and 100 (for profitable firms)
    # For negative NPM, we should clamp to 0.
    pm_norm = max(0.0, min(1.0, net_profit_margin / 100.0))
    # CFS already in [0,1]; clamp if needed.
    cfs_norm = max(0.0, min(1.0, cash_flow_stability))
    rg_norm = max(0.0, min(1.0, revenue_growth))
    ev_norm = max(0.0, min(1.0, expense_volatility))

    fhs = (weights["pm"] * pm_norm +
           weights["cfs"] * cfs_norm +
           weights["rg"] * rg_norm -
           weights["ev"] * ev_norm)
    # Clip to [0,1]
    fhs = max(0.0, min(1.0, fhs))
    logger.debug(f"FHS components: pm={pm_norm:.3f}, cfs={cfs_norm:.3f}, rg={rg_norm:.3f}, ev={ev_norm:.3f} -> FHS={fhs:.3f}")
    return fhs


def classify_risk(fhs: float, thresholds: Tuple[float, float] = (0.65, 0.35)) -> str:
    """
    Classify risk based on FHS score.

    Args:
        fhs: Financial Health Score.
        thresholds: Tuple (high_threshold, low_threshold). Default (0.65, 0.35).

    Returns:
        Risk class: "Healthy", "Moderate Risk", or "High Risk".
    """
    high_th, low_th = thresholds
    if fhs >= high_th:
        return "Healthy"
    elif fhs >= low_th:
        return "Moderate Risk"
    else:
        return "High Risk"