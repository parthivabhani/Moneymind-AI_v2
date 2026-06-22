
About 
moneymind-ai-azure.vercel.app <href> https://moneymind-ai-azure.vercel.app </href>

**An Integrated Machine Learning and LLM Framework for Personalized Financial Decision Support**

## Overview

MoneyMind-FDSS integrates five tightly coupled modules:

1. **Data Ingestion & Preprocessing** – handles missing values, outlier detection, monthly aggregation, and min‑max normalisation.
2. **Financial Analytics Engine** – computes total income, total expenses, net cash flow (NCF), net profit margin (NPM), and expense category distributions.
3. **Machine Learning Forecasting** – provides 30‑, 60‑, and 90‑day forecasts using Ordinary Least Squares (OLS) linear regression and Random Forest (RF) ensemble algorithms, validated via walk‑forward cross‑validation.
4. **Composite Financial Health Scoring (FHS)** – combines NPM, cash flow stability (CFS), revenue growth (RG), and expense volatility (EV) into a three‑tier risk classification (Healthy, Moderate Risk, High Risk).
5. **LLM‑Based Recommendation Engine** – transforms structured financial summaries into actionable, natural‑language advice using prompt engineering and state‑of‑the‑art language models (Gemini or GPT‑4o).

The system achieves a forecasting MAPE of 11.2 ± 1.5 % (RF), a risk classification accuracy of 88.0 % with a Cohen’s κ of 0.82, and expert‑rated recommendation quality of 4.19 ± 0.31 out of 5.0.

LLM API Key Setup

The recommendation engine supports both Google Gemini and OpenAI GPT‑4o. To use either, obtain an API key and set it as an environment variable.

    Google Gemini:
    Visit Google AI Studio to generate an API key.
    Set the environment variable:

export GEMINI_API_KEY="your_gemini_api_key"

OpenAI GPT‑4o:
Obtain an API key from the OpenAI platform.
Set the environment variable:

export OPENAI_API_KEY="your_openai_api_key"

# If you do not provide a valid key or the LLM API is unavailable, the system will fall back to rule‑based recommendations (enabled by default in the configuration).


<div align="center">


<br>

```diff
+ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
+ ┃                                                                                      ┃
+ ┃   ███╗   ███╗ ██████╗ ███╗   ██╗███████╗██╗   ██╗███╗   ███╗██╗███╗   ██╗██████╗    ┃
+ ┃   ████╗ ████║██╔═══██╗████╗  ██║██╔════╝╚██╗ ██╔╝████╗ ████║██║████╗  ██║██╔══██╗   ┃
+ ┃   ██╔████╔██║██║   ██║██╔██╗ ██║█████╗   ╚████╔╝ ██╔████╔██║██║██╔██╗ ██║██║  ██║   ┃
+ ┃   ██║╚██╔╝██║██║   ██║██║╚██╗██║██╔══╝    ╚██╔╝  ██║╚██╔╝██║██║██║╚██╗██║██║  ██║   ┃
+ ┃   ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║███████╗   ██║   ██║ ╚═╝ ██║██║██║ ╚████║██████╔╝   ┃
+ ┃   ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝    ┃
+ ┃                                                                                      ┃
+ ┃                 💰 AI-POWERED FINANCIAL INTELLIGENCE PLATFORM                        ┃
+ ┃                                                                                      ┃
+ ┃          📈 FORECAST CASH FLOW • 💸 ANALYZE SPENDING • ⚠ DETECT RISKS               ┃
+ ┃                                                                                      ┃
+ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
The framework provides a modular pipeline for automated financial analytics, multi‑horizon forecasting, composite risk scoring, and natural‑language advisory generation powered by large language models. It is designed for small and medium enterprises (SMEs) and individual decision‑makers.



# 💰 AI-Powered Financial Intelligence Platform

### 📈 Forecast Cash Flow • 💸 Analyze Expenses • ⚠ Detect Risks • 🚀 Drive Growth

![React](https://img.shields.io/badge/React-18-00C853?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-00E676?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-43A047?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Powered-00C853?style=for-the-badge)
![FinTech](https://img.shields.io/badge/FinTech-2E7D32?style=for-the-badge)


╔══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║  💰 FINANCIAL INTELLIGENCE ENGINE                                                    ║
║                                                                                      ║
║      Upload Transactions → Analyze Patterns → Forecast Future → Reduce Risk          ║
║                                                                                      ║
║  📊 Analytics      📈 Forecasting      💸 Categorization      ⚠ Risk Detection       ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

# 🎯 Overview

Moneymind AI transforms raw financial transactions into intelligent business insights.

Whether you're an individual managing personal finances or an SME monitoring cash flow, Moneymind AI helps you:

```text
┌───────────────────────────────────────────────┐
│                                               │
│   💰 Understand Spending Patterns             │
│   📈 Predict Future Cash Flow                 │
│   ⚠ Detect Financial Risks                    │
│   🚨 Identify Anomalous Transactions          │
│   🎯 Achieve Financial Goals                  │
│                                               │
└───────────────────────────────────────────────┘
```

---

# 💹 Financial Intelligence Suite

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ MODULE                    │ PURPOSE                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ 📊 Analytics Engine       │ Income & Expense Analysis                   │
│ 📈 Forecasting Engine     │ 30 / 60 / 90 Day Predictions                │
│ 💸 Expense Intelligence   │ Automatic Expense Categorization            │
│ ⚠ Risk Monitoring        │ Financial Risk Detection                    │
│ 🚨 Anomaly Detection     │ Fraud & Outlier Detection                   │
│ 🎯 Goal Tracking         │ Financial Goal Monitoring                   │
│ 🤖 AI Advisor            │ Personalized Recommendations                │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# 📊 Key Financial Metrics

```text
┌─────────────────┬─────────────────┬─────────────────┐
│ 💰 Total Income │ 💸 Expenses     │ 📈 Net Cashflow │
├─────────────────┼─────────────────┼─────────────────┤
│ Revenue Trends  │ Cost Tracking   │ Financial Health│
└─────────────────┴─────────────────┴─────────────────┘


┌─────────────────┬─────────────────┬─────────────────┐
│ 🏦 Profit Margin│ ⚠ Risk Score    │ 🎯 Goal Progress│
├─────────────────┼─────────────────┼─────────────────┤
│ Profitability   │ Risk Monitoring │ Target Tracking │
└─────────────────┴─────────────────┴─────────────────┘
```

---

# 🤖 AI Capabilities

```text
╔══════════════════════════════════════════════════════════╗
║                 📈 CASH FLOW FORECASTING                ║
╠══════════════════════════════════════════════════════════╣
║ • Historical Trend Analysis                             ║
║ • Linear Regression Models                              ║
║ • Moving Averages                                       ║
║ • Confidence Intervals                                  ║
║ • 30 / 60 / 90 Day Forecasts                            ║
╚══════════════════════════════════════════════════════════╝
```

```text
╔══════════════════════════════════════════════════════════╗
║              💸 EXPENSE CATEGORIZATION                  ║
╠══════════════════════════════════════════════════════════╣
║ • NLP-Based Classification                              ║
║ • Keyword Matching                                      ║
║ • Context-Aware Rules                                   ║
║ • Auto Assignment                                       ║
╚══════════════════════════════════════════════════════════╝
```

```text
╔══════════════════════════════════════════════════════════╗
║                ⚠ FINANCIAL RISK ENGINE                  ║
╠══════════════════════════════════════════════════════════╣
║ • Spending Volatility Analysis                          ║
║ • Revenue Consistency Monitoring                        ║
║ • Cash Flow Stability Checks                            ║
║ • Financial Health Scoring                              ║
╚══════════════════════════════════════════════════════════╝
```

---

# 🏗 System Architecture

```text
                              💰 TRANSACTION DATA

                                        │
                                        ▼

                    ┌─────────────────────────────────┐
                    │     CSV DATA INGESTION          │
                    └─────────────────────────────────┘
                                        │
                                        ▼

                    ┌─────────────────────────────────┐
                    │ DATA CLEANING & VALIDATION      │
                    └─────────────────────────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼

       ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
       │ 📈 FORECASTING │    │ 💸 CATEGORY AI │    │ ⚠ RISK ENGINE │
       └────────────────┘    └────────────────┘    └────────────────┘

                 ▼                      ▼                      ▼

                    ┌─────────────────────────────────┐
                    │ 🤖 RECOMMENDATION ENGINE        │
                    └─────────────────────────────────┘
                                        │
                                        ▼

                    ┌─────────────────────────────────┐
                    │ 📊 EXECUTIVE DASHBOARD          │
                    └─────────────────────────────────┘
```

---

# 📸 Dashboard Preview

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    📊 FINANCIAL DASHBOARD                  │
│                                                             │
│   Revenue     Expenses      Cashflow      Risk Score       │
│                                                             │
│     📈            📉            💰             ⚠            │
│                                                             │
│   ███████      ██████       ███████      ███████            │
│   ███████      █████        ███████      ████              │
│   ███████      ███          ███████      ██                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 🚀 Quick Start

```bash
git clone <repository-url>

cd moneymind-ai

npm install

cd server

npm install

npm run dev
```

---

# 📂 CSV Format

```csv
date,description,amount,category
2025-01-15,Client Payment,5000,Sales
2025-01-20,Office Rent,-1200,Operations
2025-01-25,Software License,-99,Technology
```

---

# 🌟 Platform Highlights

```text
✓ AI-Powered Financial Analysis

✓ Cash Flow Forecasting

✓ Expense Intelligence

✓ Risk Detection

✓ Anomaly Detection

✓ Explainable AI

✓ SME Analytics

✓ Interactive Dashboards

✓ Goal-Based Planning
```

---

# 🛣 Roadmap

```text
[✓] Financial Dashboard

[✓] Forecasting Engine

[✓] Expense Categorization

[✓] Risk Detection

[ ] Open Banking Integration

[ ] AI Financial Assistant

[ ] Credit Risk Scoring

[ ] Investment Intelligence

[ ] Multi-Currency Support
```

---

# 👨‍💻 Contributors

```text
╔══════════════════════════════════════╗
║                                      ║
║  🚀 Parthiv Abhani                  ║
║     AI & Backend Development        ║
║                                      ║
║  🚀 Aishi De                        ║
║     Frontend & Product Design       ║
║                                      ║
╚══════════════════════════════════════╝
```

---

<div align="center">

## 💰 Moneymind AI

### Transforming Financial Data Into Actionable Intelligence

📈 Forecast Better
💸 Spend Smarter
⚠ Reduce Risk
🚀 Grow Faster

</div>
```
