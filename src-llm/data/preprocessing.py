"""
Data preprocessing pipeline: missing imputation, outlier detection, aggregation, normalisation.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import numpy as np
import pandas as pd
from typing import Tuple, Optional

logger = logging.getLogger(__name__)


def impute_missing(df: pd.DataFrame, missing_threshold: float = 0.05) -> pd.DataFrame:
    """
    Impute missing numerical values using rule:
      - If missingness < 5%, set to 0.
      - Else, set to median.

    Args:
        df: DataFrame with columns 'income' and 'expense'.
        missing_threshold: Fraction of missing values below which zero imputation is used.

    Returns:
        DataFrame with imputed values.
    """
    df = df.copy()
    for col in ["income", "expense"]:
        missing_frac = df[col].isna().mean()
        if missing_frac > 0:
            if missing_frac < missing_threshold:
                df[col] = df[col].fillna(0)
                logger.info(f"Imputed {missing_frac*100:.1f}% missing in {col} with 0.")
            else:
                median_val = df[col].median()
                df[col] = df[col].fillna(median_val)
                logger.info(f"Imputed {missing_frac*100:.1f}% missing in {col} with median {median_val:.2f}.")
    return df


def detect_outliers_iqr(df: pd.DataFrame, column: str, multiplier: float = 1.5) -> pd.Series:
    """
    Detect outliers using IQR method.

    Args:
        df: DataFrame.
        column: Column name to check.
        multiplier: IQR multiplier (default 1.5).

    Returns:
        Boolean series indicating outlier rows.
    """
    data = df[column].dropna()
    if len(data) == 0:
        return pd.Series(index=df.index, data=False)

    # If data is highly skewed, log-transform for IQR computation
    skew = data.skew()
    if abs(skew) > 2:
        transformed = np.log1p(data)
        q1, q3 = np.percentile(transformed, [25, 75])
        iqr = q3 - q1
        lower = np.expm1(q1 - multiplier * iqr)
        upper = np.expm1(q3 + multiplier * iqr)
    else:
        q1, q3 = data.quantile([0.25, 0.75])
        iqr = q3 - q1
        lower = q1 - multiplier * iqr
        upper = q3 + multiplier * iqr

    # Flag outliers and mark them
    outliers = (data < lower) | (data > upper)
    logger.info(f"Detected {outliers.sum()} outliers in {column}.")
    return outliers


def aggregate_monthly(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate daily transactions into monthly summaries.

    Args:
        df: DataFrame with columns 'date', 'income', 'expense', 'category'.

    Returns:
        DataFrame with monthly aggregated income, expense, and category totals.
    """
    df = df.copy()
    df["year_month"] = df["date"].dt.to_period("M")
    # Aggregate income and expense per month
    monthly = df.groupby("year_month").agg(
        total_income=("income", "sum"),
        total_expense=("expense", "sum")
    ).reset_index()
    monthly["month"] = monthly["year_month"].dt.to_timestamp()
    monthly = monthly.sort_values("month")
    return monthly


def min_max_normalize(train_values: np.ndarray, val_values: Optional[np.ndarray] = None) -> Tuple[np.ndarray, dict]:
    """
    Min-max normalisation using training set min/max.

    Args:
        train_values: Training data array.
        val_values: Optional validation/test array.

    Returns:
        Normalised train array, normalised val array (if provided), and parameters dict.
    """
    min_val = train_values.min()
    max_val = train_values.max()
    if max_val - min_val == 0:
        logger.warning("Zero range in training data; returning zeros.")
        norm_train = np.zeros_like(train_values)
        norm_val = np.zeros_like(val_values) if val_values is not None else None
    else:
        norm_train = (train_values - min_val) / (max_val - min_val)
        if val_values is not None:
            norm_val = (val_values - min_val) / (max_val - min_val)
        else:
            norm_val = None
    params = {"min": min_val, "max": max_val}
    return norm_train, norm_val, params


def preprocess_pipeline(
    df: pd.DataFrame,
    missing_threshold: float = 0.05,
    outlier_multiplier: float = 1.5,
    normalise: bool = True
) -> pd.DataFrame:
    """
    Complete preprocessing pipeline:
      1. Impute missing values.
      2. Detect outliers (flagged but kept).
      3. Aggregate to monthly.
      4. Normalise (if requested) using training data min/max.

    For production, normalisation parameters should be computed on training split only.

    Args:
        df: Raw transaction DataFrame.
        missing_threshold: Threshold for imputation strategy.
        outlier_multiplier: IQR multiplier for outlier detection.
        normalise: If True, apply min-max normalisation.

    Returns:
        Preprocessed monthly DataFrame with additional columns.
    """
    logger.info("Starting preprocessing pipeline.")
    # Impute
    df = impute_missing(df, missing_threshold)

    # Outlier detection (flag only)
    for col in ["income", "expense"]:
        outlier_mask = detect_outliers_iqr(df, col, multiplier=outlier_multiplier)
        df[f"{col}_outlier"] = outlier_mask
        logger.info(f"Outlier flag added for {col}: {outlier_mask.sum()} flagged.")

    # Aggregate monthly
    monthly = aggregate_monthly(df)
    logger.info(f"Aggregated to {len(monthly)} months.")

    # Optional normalisation (using all data for simplicity; in practice split)
    if normalise:
        # Normalise income and expense across entire monthly series
        income_norm, _, _ = min_max_normalize(monthly["total_income"].values)
        expense_norm, _, _ = min_max_normalize(monthly["total_expense"].values)
        monthly["income_norm"] = income_norm
        monthly["expense_norm"] = expense_norm
        logger.info("Min-max normalisation applied to income and expense.")

    # Add time index
    monthly["time_idx"] = np.arange(1, len(monthly) + 1)
    return monthly
