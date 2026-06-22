#!/usr/bin/env python
"""
Create SME transaction data and risk profiles.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import argparse
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path

def generate_transactions(months=24, seed=42):
    np.random.seed(seed)
    start_date = datetime(2023, 1, 1)
    dates = [start_date + timedelta(days=i) for i in range(months*30)]  # approx daily
    
    # Parameters from Table 5
    mean_income = 450000
    seasonal_amplitude = 0.08  # ±8% seasonal
    growth_rate = 0.018  # 1.8% monthly compound
    categories = ["Salaries", "Infrastructure", "Marketing", "Operations", "R&D", "Miscellaneous"]
    expense_weights = [0.42, 0.18, 0.12, 0.11, 0.10, 0.07]
    
    records = []
    month_counter = 0
    for i, date in enumerate(dates):
        month = date.month
        # seasonal pattern: Q4 uplift +15%, Q2 dip -8%
        seasonal = 1.0
        if month in [10, 11, 12]:
            seasonal += 0.15
        elif month in [4, 5, 6]:
            seasonal -= 0.08
        
        # monthly growth trend
        month_idx = i / 30  # approximate month
        trend = (1 + growth_rate) ** month_idx
        
        # income with noise
        income = mean_income * trend * seasonal * (1 + np.random.normal(0, 0.05))
        income = max(0, income)
        
        # expenses: sum of categories with noise
        base_expense = income * np.random.uniform(0.6, 0.85)
        expense = base_expense * (1 + np.random.normal(0, 0.07))
        expense = max(0, expense)
        
        # allocate to categories
        cat_expenses = np.random.multinomial(round(expense), expense_weights)
        for cat, amt in zip(categories, cat_expenses):
            records.append({
                "date": date.strftime("%Y-%m-%d"),
                "income": income if i % 5 == 0 else 0,  # income appears irregularly
                "expense": amt,
                "category": cat
            })
    
    df = pd.DataFrame(records)
    # Aggregate to daily records; the pipeline will aggregate monthly.
    # Ensure we have some income each month; we'll add a fixed income at month start.
    # We'll do a simple approach: for each month, add one income record equal to total monthly income, and distribute expenses.
    # We should have daily expenses and occasional income.
    # The above is a simplification; we'll adjust to match the monthly aggregates.
    # Instead, we directly use monthly aggregates and then expand to daily with random distribution.
    # Let's do that more precisely.
    
    # Better: generate monthly totals then distribute to daily.
    monthly_income = []
    monthly_expense = []
    for m in range(months):
        month_date = start_date + timedelta(days=30*m)
        # compute monthly income using formula
        seasonal = 1.0
        if month_date.month in [10,11,12]:
            seasonal += 0.15
        elif month_date.month in [4,5,6]:
            seasonal -= 0.08
        trend = (1 + growth_rate) ** m
        inc = mean_income * trend * seasonal * (1 + np.random.normal(0, 0.04))
        inc = max(0, inc)
        # expenses: roughly 70-80% of income
        exp = inc * np.random.uniform(0.70, 0.85) * (1 + np.random.normal(0, 0.05))
        exp = max(0, exp)
        monthly_income.append(inc)
        monthly_expense.append(exp)
    
    # Expand to daily: for each month, create daily records with expenses spread across categories.
    all_records = []
    for m in range(months):
        month_start = start_date + timedelta(days=30*m)
        days_in_month = 30
        inc = monthly_income[m]
        exp = monthly_expense[m]
        # Distribute income on a few days (e.g., 1st and 15th)
        income_days = [0, 14]  # day indices
        for day_idx in income_days:
            if day_idx < days_in_month:
                date = month_start + timedelta(days=day_idx)
                share = 0.5 if len(income_days) > 1 else 1.0
                all_records.append({"date": date.strftime("%Y-%m-%d"), "income": inc * share, "expense": 0, "category": ""})
        # Distribute expenses daily across categories
        cat_amounts = np.random.multinomial(round(exp), expense_weights, size=days_in_month).sum(axis=0)
        for cat, total_cat in zip(categories, cat_amounts):
            # distribute evenly across days
            daily_amt = total_cat / days_in_month
            for day_idx in range(days_in_month):
                date = month_start + timedelta(days=day_idx)
                # add small variation
                amt = daily_amt * (1 + np.random.normal(0, 0.1))
                amt = max(0, amt)
                all_records.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "income": 0,
                    "expense": amt,
                    "category": cat
                })
    
    df = pd.DataFrame(all_records)
    # Aggregate to monthly for sanity
    df['date'] = pd.to_datetime(df['date'])
    monthly = df.groupby(df['date'].dt.to_period("M")).agg({'income':'sum','expense':'sum'})
    print(monthly.head())
    
    # Save
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} records, saved to {output_path}")

def generate_risk_profiles(n=150, seed=42):
    np.random.seed(seed)
    profiles = []
    for i in range(n):
        # Generate components with correlations to produce three classes
        # We'll create distributions for each class
        if i < 50:  # Healthy
            pm = np.random.uniform(15, 40)
            cfs = np.random.uniform(0.7, 1.0)
            rg = np.random.uniform(0.5, 1.0)
            ev = np.random.uniform(0.0, 0.3)
            risk_class = "Healthy"
        elif i < 100:  # Moderate
            pm = np.random.uniform(5, 20)
            cfs = np.random.uniform(0.4, 0.75)
            rg = np.random.uniform(0.2, 0.7)
            ev = np.random.uniform(0.2, 0.6)
            risk_class = "Moderate Risk"
        else:  # High
            pm = np.random.uniform(-5, 8)
            cfs = np.random.uniform(0.0, 0.45)
            rg = np.random.uniform(0.0, 0.3)
            ev = np.random.uniform(0.4, 1.0)
            risk_class = "High Risk"
        profiles.append({
            "components": {
                "net_profit_margin": pm,
                "cash_flow_stability": cfs,
                "revenue_growth": rg,
                "expense_volatility": ev
            },
            "risk_class": risk_class
        })
    return profiles

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="data/sample/transactions.csv", help="Output CSV path")
    parser.add_argument("--profiles_output", default="data/calibration/profiles.json", help="Output JSON for risk profiles")
    parser.add_argument("--months", type=int, default=24)
    args = parser.parse_args()
    generate_transactions(args.months, output=args.output)
    profiles = generate_risk_profiles()
    with open(args.profiles_output, 'w') as f:
        json.dump(profiles, f, indent=2)
    print(f"Saved {len(profiles)} risk profiles to {args.profiles_output}")
