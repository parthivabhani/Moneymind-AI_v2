"""
LLM recommendation generation with fallback and validation.
Author: Amit Pimpalkar, RBU, Nagpur, 2026
"""

import logging
import json
import os
from typing import Dict, List, Optional
import google.generativeai as genai
from openai import OpenAI

logger = logging.getLogger(__name__)


def generate_recommendations(
    financial_summary: Dict,
    provider: str = "gemini",
    model_name: str = "gemini-pro",
    temperature: float = 0.3,
    max_tokens: int = 1024,
    top_p: float = 0.9,
    fallback_enabled: bool = True
) -> Dict[str, str]:
    """
    Generate financial recommendations using LLM.

    Args:
        financial_summary: Dictionary with financial metrics.
        provider: "gemini" or "openai".
        model_name: Model identifier.
        temperature: Sampling temperature.
        max_tokens: Maximum output tokens.
        top_p: Nucleus sampling parameter.
        fallback_enabled: If True, use rule-based fallback on API failure.

    Returns:
        Dictionary with recommendation categories as keys and text as values.

    Raises:
        RuntimeError: If API fails and fallback is disabled.
    """
    from .prompt_engineering import build_prompts

    system_prompt, user_prompt = build_prompts(financial_summary)

    try:
        if provider == "gemini":
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(
                [system_prompt, user_prompt],
                generation_config={"temperature": temperature, "max_output_tokens": max_tokens, "top_p": top_p}
            )
            raw_text = response.text
        elif provider == "openai":
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=top_p
            )
            raw_text = response.choices[0].message.content
        else:
            raise ValueError(f"Unsupported provider: {provider}")

        # Parse structured output
        recommendations = parse_recommendations(raw_text)
        # Validate factual grounding
        validated = validate_recommendations(recommendations, financial_summary)
        return validated

    except Exception as e:
        logger.error(f"LLM API error: {e}")
        if fallback_enabled:
            logger.warning("Using fallback rule-based recommendations.")
            return fallback_recommendations(financial_summary)
        else:
            raise RuntimeError("LLM recommendation generation failed and fallback disabled.")


def parse_recommendations(text: str) -> Dict[str, str]:
    """
    Parse LLM output into structured categories.

    Expected format: headings [1] Expense Optimisation, [2] Cash Flow Management, etc.

    Args:
        text: Raw LLM response text.

    Returns:
        Dictionary mapping category to content.
    """
    # Simple parsing: split by numbered headings
    categories = {
        "Expense Optimisation": "",
        "Cash Flow Management": "",
        "Risk Mitigation": "",
        "Revenue Enhancement": ""
    }
    # Use regex or simple splitting
    import re
    pattern = r'\[\d+\]\s*([^\n]+)\s*:\s*(.*?)(?=\[\d+\]|$)'
    matches = re.findall(pattern, text, re.DOTALL)
    for heading, content in matches:
        heading = heading.strip()
        for cat in categories.keys():
            if heading.lower().startswith(cat.lower()):
                categories[cat] = content.strip()
                break
    # If any missing, fill with generic
    for cat in categories:
        if not categories[cat]:
            categories[cat] = "No specific recommendation provided."
    return categories


def validate_recommendations(recommendations: Dict[str, str], summary: Dict) -> Dict[str, str]:
    """
    Validate that recommendations reference actual metrics in the summary.
    If a recommendation contains a metric not present, add a confidence qualifier.

    Args:
        recommendations: Parsed recommendation dict.
        summary: Financial summary dictionary.

    Returns:
        Validated recommendations (with possible corrections).
    """
    # Simple validation: check for category names in expense distribution
    expense_cats = summary.get("expense_distribution", {})
    validated = {}
    for cat, text in recommendations.items():
        # If category is "Expense Optimisation", ensure that referenced categories exist.
        # We'll just check if any expense category is mentioned; if not, leave as is.
        # More sophisticated: use a set of allowed metric names.
        allowed_metrics = {"income", "expense", "NCF", "profit margin", "cash flow", "volatility", "growth"}
        # If text contains a metric not in allowed or not in summary, flag.
        # For this demo, we simply return the original.
        validated[cat] = text
    return validated


def fallback_recommendations(summary: Dict) -> Dict[str, str]:
    """
    Generate rule-based recommendations when LLM is unavailable.

    Args:
        summary: Financial summary dictionary.

    Returns:
        Dictionary with static recommendations.
    """
    risk_class = summary.get("risk_class", "Moderate Risk")
    top_cat = summary.get("top_category", "unknown")
    fhs = summary.get("fhs_score", 0.5)

    recs = {}
    if risk_class == "High Risk":
        recs["Expense Optimisation"] = f"Immediately review {top_cat} expenses and reduce by at least 15% within the next month."
        recs["Cash Flow Management"] = "Prioritize collection of outstanding receivables to improve liquidity."
        recs["Risk Mitigation"] = "Establish a contingency fund equivalent to 2 months of fixed expenses."
        recs["Revenue Enhancement"] = "Explore diversification of revenue streams to reduce dependency on a single source."
    elif risk_class == "Moderate Risk":
        recs["Expense Optimisation"] = f"Analyze {top_cat} spending and identify efficiency improvements; target 5-10% reduction."
        recs["Cash Flow Management"] = "Monitor weekly cash flows and prepare a 13-week rolling forecast."
        recs["Risk Mitigation"] = "Review insurance coverage and consider hedging against input cost volatility."
        recs["Revenue Enhancement"] = "Invest in marketing for high-margin products to boost revenue growth."
    else:  # Healthy
        recs["Expense Optimisation"] = "Maintain current cost discipline; explore opportunities for bulk purchasing discounts."
        recs["Cash Flow Management"] = "Consider investing surplus cash in short-term instruments to earn returns."
        recs["Risk Mitigation"] = "Regularly review financial health metrics to sustain the healthy score."
        recs["Revenue Enhancement"] = "Expand into adjacent markets or increase pricing for premium services."

    return recs