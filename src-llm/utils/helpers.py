"""
Helper utilities for configuration and I/O.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import json
import yaml
import logging
from pathlib import Path
from typing import Any, Dict

logger = logging.getLogger(__name__)


def load_config(config_path: str) -> Dict[str, Any]:
    """
    Load configuration from YAML file.

    Args:
        config_path: Path to YAML config file.

    Returns:
        Dictionary of configuration.
    """
    path = Path(config_path)
    if not path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")
    with open(path, 'r') as f:
        config = yaml.safe_load(f)
    logger.info(f"Loaded configuration from {config_path}")
    return config


def save_json(data: Dict, file_path: str) -> None:
    """
    Save data as JSON.

    Args:
        data: Dictionary to save.
        file_path: Output file path.
    """
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    logger.info(f"Data saved to {file_path}")