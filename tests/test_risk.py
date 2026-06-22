"""
Unit tests for risk module.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import pytest
from src.risk.fhs import compute_fhs, classify_risk


def test_fhs():
    fhs = compute_fhs(15.0, 0.8, 0.5, 0.2)
    assert 0 <= fhs <= 1


def test_classify_risk():
    assert classify_risk(0.8) == "Healthy"
    assert classify_risk(0.5) == "Moderate Risk"
    assert classify_risk(0.3) == "High Risk"