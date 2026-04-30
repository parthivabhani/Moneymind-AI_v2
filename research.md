# AI Integration Architecture & Research Overview

## Tech Stack
* **Frontend**: React, TailwindCSS, Recharts (Data Visualization)
* **Backend**: Node.js, Express, TypeScript
* **AI Integration**: Groq SDK (Inference-as-a-Service)

## Flow of the model
1. **Data Ingestion**: Raw CSV transactions are parsed and uploaded via the frontend.
2. **AI Batch Categorization**: Uncategorized transactions are batched (to minimize API overhead) and sent via prompt to the classification LLM.
3. **Statistical Aggregation**: The backend computes simple moving averages, linear regressions (for forecasting), and threshold-based risk profiles.
4. **Contextual Generation**: Calculated metrics and risk indicators are injected into a prompt for the summarization LLM.
5. **Rendering**: The structured JSON categories and the natural language executive summary are sent back and rendered on the React dashboard.

## Architecture of the model
* **Core Architecture**: The system utilizes **Llama 3** foundation models, which are autoregressive, decoder-only transformer architectures. 
* **Deployment Architecture**: Rather than local hosting, the architecture relies on an API layer. The inference is executed on Groq's custom hardware (LPUs - Language Processing Units), optimized specifically for deterministic, ultra-low latency token generation. 
* **Fallback Strategy**: A Hybrid-Heuristic architecture; if API limits are hit, the system seamlessly routes down to local deterministic algorithms (Regex/Keyword matching).

## Dataset (For Research Purposes)
The dashboard utilizes zero-shot pre-trained models, meaning no custom dataset was used to fine-tune it locally. 

If you are writing a research paper and wish to fine-tune a model or evaluate the accuracy of this categorization flow, you can use these public datasets:
* **Recommendation**: *Bank Transaction Data for Categorization* (Synthetically generated or anonymized transactional ledgers).
* **Dataset Link**: [Kaggle - Bank Account Transaction Dataset](https://www.kaggle.com/datasets/krutikabhatt/bank-transaction-dataset) or the [PaySim Synthetic Financial Dataset](https://www.kaggle.com/datasets/ealaxi/paysim1). These contain raw descriptions and categorical mappings ideal for training classification models.

## ML Models & APIs Used
* **API Provider**: Groq API
* **Model 1 (Categorization Engine)**: `llama-3.1-8b-instant` — Chosen for high-throughput, low-latency zero-shot classification.
* **Model 2 (Executive Analyst)**: `llama-3.3-70b-versatile` — Chosen for its advanced reasoning capabilities and natural language generation to act as an "AI CFO."
1.  **Rule-Based Keyword Matching (NLP Heuristic):** If the AI API fails, the backend routes to a local script (`services/categorizer.ts`) which uses a hardcoded dictionary mapping. It simply flags if the word "salary" is in the transaction description and tags it "Payroll." It does not "understand" language context locally.
2.  **Simple Moving Averages (Statistical Forecasting):** To project the "Cash Flow Forecast," the codebase (`services/forecastService.ts`) calculates a basic 3-month moving average combined with a simple trend coefficient.
3.  **Ordinary Least Squares (OLS) Linear Regression:** There is actually a function written locally (`linearRegressionForecast`) to forecast data using classical linear regression, but it's currently built as a utility statistical function.
4.  **Threshold-Based Risk Algorithms:** The `riskAnalyzer.ts` calculates volatility and concentration risk simply by doing percentage math against the average (e.g., if expenses spike more than 15% above the mean, flag as "Warning").


## Output
* **Model 1 Output**: A strictly formatted JSON object mapping unique `transaction_ids` to predefined financial classes (e.g., `'Sales'`, `'Payroll'`, `'Technology'`).
* **Model 2 Output**: A concise, natural language paragraph (maximum 3 sentences) providing actionable, context-aware business insights based on the provided numerical metrics.

## Conclusion
The Moneymind AI dashboard circumvents the need for complex, heavy, locally deployed Machine Learning pipelines by leveraging high-speed LLM APIs. By combining zero-shot generative AI for unstructured data analysis (categorization and summarization) with localized traditional statistics (linear aggregation and heuristics), the platform achieves a highly resilient, enterprise-grade AI financial analyst with minimal computational overhead.
