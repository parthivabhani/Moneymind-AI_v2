"""
Computation of key financial metrics: total income, total expenses, NCF, NPM, etc.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import numpy as np
import pandas as pd
from typing import Dict, List

logger = logging.getLogger(__name__)


def compute_kpis(monthly_df: pd.DataFrame) -> Dict:
    """
    Compute financial KPIs from monthly aggregated data.

    Args:
        monthly_df: DataFrame with columns 'total_income', 'total_expense', and optionally 'time_idx'.

    Returns:
        Dictionary containing:
            total_income, total_expense, net_cash_flow, net_profit_margin,
            monthly_ncf_series, coefficient_of_variation_ncf, income_growth.
    """
    if len(monthly_df) < 3:
        logger.warning("Fewer than 3 months of data; some metrics may be unreliable.")

    total_income = monthly_df["total_income"].sum()
    total_expense = monthly_df["total_expense"].sum()
    ncf = total_income - total_expense
    npm = (ncf / total_income * 100) if total_income > 0 else 0.0

    # Monthly NCF series
    monthly_ncf = monthly_df["total_income"] - monthly_df["total_expense"]

    # Coefficient of variation of NCF
    mean_ncf = monthly_ncf.mean()
    std_ncf = monthly_ncf.std(ddof=1)
    cov_ncf = (std_ncf / abs(mean_ncf) * 100) if abs(mean_ncf) > 0 else np.inf

    # Income growth (first to last month)
    first_income = monthly_df["total_income"].iloc[0]
    last_income = monthly_df["total_income"].iloc[-1]
    income_growth = ((last_income - first_income) / first_income * 100) if first_income > 0 else 0.0

    metrics = {
        "total_income": total_income,
        "total_expense": total_expense,
        "net_cash_flow": ncf,
        "net_profit_margin": npm,
        "monthly_ncf": monthly_ncf.tolist(),
        "cov_ncf": cov_ncf,
        "income_growth": income_growth,
        "first_income": first_income,
        "last_income": last_income,
    }
    logger.info(f"KPIs computed: total_income={total_income:.2f}, net_cash_flow={ncf:.2f}, npm={npm:.2f}%")
    return metrics


def compute_expense_distribution(monthly_df: pd.DataFrame, categories: List[str]) -> Dict[str, float]:
    """
    Compute expense distribution across categories from the original transaction data.

    This function assumes that the monthly_df has already been aggregated but we need category breakdown.
    In practice, we need to compute from raw data.
    A real implementation would join with category-level aggregation.

    Args:
        monthly_df: DataFrame containing raw category data (or pre-aggregated by category).
        categories: List of category names.

    Returns:
        Dictionary mapping category to percentage of total expenses.
    """
    # For demonstration, we assume monthly_df has category totals. In a real system,
    # this would be computed during aggregation.
    logger.warning("Expense distribution computation is a placeholder; implement with actual category data.")
    # distribution
    dist = {cat: 100.0 / len(categories) for cat in categories}
    return dist