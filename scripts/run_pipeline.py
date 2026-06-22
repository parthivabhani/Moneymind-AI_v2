#!/usr/bin/env python
"""
Orchestrate the entire MoneyMind pipeline from CSV to recommendations.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import sys
import os
import argparse
import logging
import json
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.utils.logging import setup_logging
from src.utils.helpers import load_config, save_json
from src.data.ingestion import load_transactions
from src.data.preprocessing import preprocess_pipeline
from src.analytics.financial_metrics import compute_kpis, compute_expense_distribution
from src.forecasting import OLSForecaster, RandomForestForecaster
from src.forecasting.cross_validation import walk_forward_validation
from src.risk.fhs import compute_fhs, classify_risk
from src.llm.recommendation import generate_recommendations

logger = logging.getLogger(__name__)


def main(args):
    setup_logging()
    config = load_config(args.config)

    # 1. Load data
    df = load_transactions(args.input, config['data']['required_columns'])
    monthly = preprocess_pipeline(df, **config['preprocessing'])

    # 2. Compute KPIs
    kpis = compute_kpis(monthly)
    expense_dist = compute_expense_distribution(monthly, config['financial_metrics']['expense_categories'])
    # Top category
    top_cat = max(expense_dist, key=expense_dist.get) if expense_dist else "None"
    top_pct = expense_dist.get(top_cat, 0.0)

    # 3. Forecasting
    # Use income series
    y_income = monthly['total_income'].values
    # Walk-forward validation to get models? For production, we use last model.
    # Here we train on all data and forecast.
    # For demonstration, we use OLS for simplicity.
    # Actually we need to train final model on all available data.
    X_all = np.arange(len(monthly)).reshape(-1, 1)
    y_expense = monthly['total_expense'].values

    # Train OLS on all data
    ols = OLSForecaster()
    ols.fit(X_all, y_income)
    # Forecast next 3 months (30,60,90 days)
    future_steps = [30, 60, 90]  # days, but we use months index
    # Assume monthly granularity; we forecast next 3 months (step 1 month each)
    # Convert days to months: 30,60,90 days = 1,2,3 months
    horizon_months = [1, 2, 3]
    last_idx = len(monthly)
    X_future = np.array([last_idx + h - 1 for h in horizon_months]).reshape(-1, 1)  # -1 because 0-index
    income_forecast = ols.predict(X_future)
    # Also expense forecast
    ols_exp = OLSForecaster()
    ols_exp.fit(X_all, y_expense)
    expense_forecast = ols_exp.predict(X_future)

    # 4. Risk Analysis
    # Compute cash flow stability
    monthly_ncf = monthly['total_income'] - monthly['total_expense']
    cov_ncf = kpis['cov_ncf']
    cfs = 1 - cov_ncf / 100 if cov_ncf < 100 else 0.0
    # Revenue growth: normalised (from kpis)
    # For FHS, we need normalised values. We'll compute rough normalisation.
    # Using the same scaling as in the manuscript.
    # We'll assume PM already scaled (percentage)
    npm = kpis['net_profit_margin']
    # Revenue growth normalised: we'll use income_growth from kpis and clamp to [0,1]
    rg = max(0.0, min(1.0, kpis['income_growth'] / 100.0))  # simplistic
    # Expense volatility: from monthly expenses
    exp_std = monthly['total_expense'].std(ddof=1)
    exp_mean = monthly['total_expense'].mean()
    cov_exp = (exp_std / exp_mean * 100) if exp_mean > 0 else 0.0
    ev = min(1.0, cov_exp / 100.0)  # cap at 1

    fhs = compute_fhs(npm, cfs, rg, ev, config['risk']['fhs_weights'])
    risk_class = classify_risk(fhs, (config['risk']['thresholds']['healthy'], config['risk']['thresholds']['high_risk']))

    # 5. LLM Recommendations
    summary = {
        "reporting_period": monthly['month'].iloc[-1].strftime("%Y-%m-%d"),
        "total_income": kpis['total_income'],
        "total_expense": kpis['total_expense'],
        "net_cash_flow": kpis['net_cash_flow'],
        "net_profit_margin": npm,
        "forecast_income_30": income_forecast[0],
        "forecast_expense_30": expense_forecast[0],
        "fhs_score": fhs,
        "risk_class": risk_class,
        "expense_distribution": expense_dist,
        "top_category": top_cat,
        "top_percentage": top_pct,
        "revenue_growth": kpis['income_growth'],
        "cov_ncf": cov_ncf,
        "currency": "INR"
    }

    recommendations = generate_recommendations(
        summary,
        provider=config['llm']['provider'],
        model_name=config['llm']['model_name'],
        temperature=config['llm']['temperature'],
        max_tokens=config['llm']['max_tokens'],
        top_p=config['llm']['top_p'],
        fallback_enabled=config['llm']['fallback_enabled']
    )

    # 6. Output
    output = {
        "financial_metrics": kpis,
        "expense_distribution": expense_dist,
        "forecasts": {"income": income_forecast.tolist(), "expense": expense_forecast.tolist()},
        "risk": {"fhs": fhs, "class": risk_class},
        "recommendations": recommendations
    }

    save_json(output, args.output)
    logger.info("Pipeline completed successfully.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run MoneyMind pipeline.")
    parser.add_argument("--input", required=True, help="Path to input CSV transaction file.")
    parser.add_argument("--output", required=True, help="Path to output JSON file.")
    parser.add_argument("--config", default="config/default.yaml", help="Path to configuration file.")
    args = parser.parse_args()
    main(args)