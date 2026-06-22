"""
Setup module for MoneyMind-FDSS framework.
Author: Amit Pimpalkar
Organization: RBU, Nagpur
Year: 2026
"""

from setuptools import setup, find_packages

setup(
    name="moneymind-fdss",
    version="1.0.0",
    description="Integrated ML and LLM Framework for Personalized Financial Decision Support",
    author="Amit Pimpalkar",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "pandas>=1.5.0",
        "numpy>=1.23.0",
        "scikit-learn>=1.2.0",
        "statsmodels>=0.13.0",
        "matplotlib>=3.5.0",
        "seaborn>=0.12.0",
        "plotly>=5.10.0",
        "pyyaml>=6.0",
        "python-dotenv>=0.20.0",
        "google-generativeai>=0.3.0",
        "openai>=1.0.0",
        "requests>=2.28.0",
    ],
    python_requires=">=3.8",
)
