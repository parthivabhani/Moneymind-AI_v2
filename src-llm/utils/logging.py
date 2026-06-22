"""
Logging setup utility.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import logging.config
import yaml
from pathlib import Path


def setup_logging(config_path: str = "config/logging.yaml", default_level=logging.INFO):
    """
    Setup logging configuration from YAML file.

    Args:
        config_path: Path to logging YAML config.
        default_level: Default logging level if config not found.
    """
    path = Path(config_path)
    if path.exists():
        with open(path, 'r') as f:
            config = yaml.safe_load(f)
        logging.config.dictConfig(config)
    else:
        logging.basicConfig(level=default_level)
        logging.warning(f"Logging config not found at {config_path}, using basic config.")