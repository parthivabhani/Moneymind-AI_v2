"""
Data ingestion module for reading CSV transaction data.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import pandas as pd
from typing import Optional
from pathlib import Path

logger = logging.getLogger(__name__)


def load_transactions(file_path: str, required_columns: Optional[list] = None) -> pd.DataFrame:
    """
    Load transaction data from CSV file with validation.

    Args:
        file_path: Path to the CSV file.
        required_columns: List of required column names. If None, uses default set.

    Returns:
        DataFrame containing transaction records.

    Raises:
        ValueError: If required columns are missing or file cannot be read.
    """
    if required_columns is None:
        required_columns = ["date", "income", "expense", "category"]

    file_path = Path(file_path)
    if not file_path.exists():
        raise FileNotFoundError(f"Data file not found: {file_path}")

    try:
        df = pd.read_csv(file_path)
        logger.info(f"Loaded {len(df)} records from {file_path}")
    except Exception as e:
        logger.error(f"Failed to read CSV: {e}")
        raise

    # Validate columns
    missing = set(required_columns) - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    # Basic type conversion
    df["date"] = pd.to_datetime(df["date"])
    df["income"] = pd.to_numeric(df["income"], errors="coerce").fillna(0.0)
    df["expense"] = pd.to_numeric(df["expense"], errors="coerce").fillna(0.0)
    df["category"] = df["category"].astype(str)

    # Ensure non-negative
    if (df["income"] < 0).any() or (df["expense"] < 0).any():
        logger.warning("Negative values found; clipping to zero.")
        df["income"] = df["income"].clip(lower=0)
        df["expense"] = df["expense"].clip(lower=0)

    logger.info(f"Data validated: {len(df)} records, date range {df['date'].min()} to {df['date'].max()}")
    return df