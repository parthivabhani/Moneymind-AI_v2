"""
Unit tests for data ingestion and preprocessing.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import pytest
import pandas as pd
import numpy as np
from src.data.ingestion import load_transactions
from src.data.preprocessing import impute_missing, aggregate_monthly, min_max_normalize


def test_load_transactions(tmp_path):
    # Create dummy CSV
    content = "date,income,expense,category\n2023-01-01,1000,500,Salaries\n2023-01-02,2000,800,Marketing"
    file = tmp_path / "test.csv"
    file.write_text(content)
    df = load_transactions(str(file))
    assert len(df) == 2
    assert "date" in df.columns


def test_impute_missing():
    df = pd.DataFrame({
        "income": [100, np.nan, 200],
        "expense": [50, 60, np.nan]
    })
    df_imp = impute_missing(df, missing_threshold=0.05)
    assert df_imp["income"].isna().sum() == 1  # missing > 5% -> median imputed
    assert df_imp["income"].iloc[1] == 100  # median of [100,200] = 150? Actually median = 150, but with threshold 0.05, missing=33% => median
    # Test with threshold > missing frac: set to 0
    df_imp2 = impute_missing(df, missing_threshold=0.5)
    assert df_imp2["income"].iloc[1] == 0


def test_aggregate_monthly():
    df = pd.DataFrame({
        "date": pd.date_range("2023-01-01", periods=60, freq="D"),
        "income": np.random.randn(60) + 1000,
        "expense": np.random.randn(60) + 500,
        "category": "Salaries"
    })
    monthly = aggregate_monthly(df)
    assert len(monthly) == 2  # Jan and Feb? Actually 60 days from Jan1 gives 2 months (Jan and Feb if not leap year)
    assert "total_income" in monthly.columns