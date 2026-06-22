"""
Prompt engineering for LLM recommendation generation.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import json
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)


def build_prompts(financial_summary: Dict[str, object]) -> Tuple[str, str]:
    """
    Construct system and user prompts for the LLM.

    Args:
        financial_summary: Dictionary containing all necessary financial metrics.

    Returns:
        Tuple (system_prompt, user_prompt).
    """
    system_prompt = (
        "You are an expert financial analyst who specialises in financial advisory for SMEs. "
        "You should provide specific and actionable recommendations based on structured financial information. "
        "Answer ONLY in structured recommendations with the four headings: "
        "[1] Expense Optimisation, [2] Cash Flow Management, [3] Risk Mitigation, [4] Revenue Enhancement. "
        "Every recommendation should: "
        "(a) Reference a specific metric from the data provided, "
        "(b) Outline a tangible action with a measurable target, "
        "(c) Include an implementation timeframe. "
        "Avoid commenting on data that is not provided."
    )

    # Build user prompt with placeholders filled
    user_template = (
        "Financial Summary (as of {reporting_period}):\n"
        "Total Income: {total_income} {currency}\n"
        "Total Expenses: {total_expense} {currency}\n"
        "Net Cash Flow: {net_cash_flow} {currency} {ncf_direction}\n"
        "Net Profit Margin: {net_profit_margin}%\n"
        "30-Day Forecast (Income): {forecast_income_30} {currency}\n"
        "30-Day Forecast (Expense): {forecast_expense_30} {currency}\n"
        "Financial Health Score: {fhs_score:.2f} -> Risk Class: {risk_class}\n"
        "Expense Distribution: {expense_distribution}\n"
        "Top Expense Category: {top_category} {top_percentage}% of total expenses\n"
        "Revenue Growth (period): {revenue_growth}%\n"
        "Cash Flow CoV: {cov_ncf}%\n"
    )

    # Fill placeholders
    summary = financial_summary
    ncf_direction = "positive" if summary.get("net_cash_flow", 0) >= 0 else "negative"
    user_prompt = user_template.format(
        reporting_period=summary.get("reporting_period", "current"),
        total_income=summary.get("total_income", 0.0),
        total_expense=summary.get("total_expense", 0.0),
        net_cash_flow=summary.get("net_cash_flow", 0.0),
        ncf_direction=ncf_direction,
        net_profit_margin=summary.get("net_profit_margin", 0.0),
        forecast_income_30=summary.get("forecast_income_30", 0.0),
        forecast_expense_30=summary.get("forecast_expense_30", 0.0),
        fhs_score=summary.get("fhs_score", 0.0),
        risk_class=summary.get("risk_class", "Unknown"),
        expense_distribution=json.dumps(summary.get("expense_distribution", {})),
        top_category=summary.get("top_category", "N/A"),
        top_percentage=summary.get("top_percentage", 0.0),
        revenue_growth=summary.get("revenue_growth", 0.0),
        cov_ncf=summary.get("cov_ncf", 0.0),
        currency=summary.get("currency", "INR")
    )
    logger.info("Prompts built successfully.")
    return system_prompt, user_prompt