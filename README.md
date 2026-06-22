# 💰 Moneymind AI

### AI-Powered Financial Intelligence Platform for Individuals & Small Businesses

<p align="center">

![Finance](https://img.shields.io/badge/Domain-FinTech-00C853?style=for-the-badge)
![AI](https://img.shields.io/badge/Powered%20By-AI-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge\&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge\&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge\&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</p>

<p align="center">
  <b>Transform raw financial data into intelligent business decisions.</b>
</p>

---

## 📌 Overview

**Moneymind AI** is an intelligent financial analysis platform designed to help individuals, startups, and SMEs gain deeper visibility into their finances through AI-driven insights, forecasting, risk detection, and automated expense analysis.

Instead of manually analyzing spreadsheets and transaction histories, users can upload their financial data and instantly receive:

✅ Cash flow forecasts
✅ Risk assessments
✅ Expense categorization
✅ Anomaly detection
✅ Actionable AI recommendations
✅ Financial health monitoring

---

## 🎯 Problem Statement

Many individuals and small businesses struggle with:

* Poor cash flow visibility
* Unplanned financial risks
* Manual expense tracking
* Inefficient budgeting
* Lack of predictive financial insights

Moneymind AI solves these challenges using Machine Learning and intelligent analytics.

---

# ✨ Key Features

| Feature                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| 📂 Financial Data Upload  | Upload CSV transaction files                 |
| 📊 Smart Dashboard        | Visualize income, expenses, profit & trends  |
| 🤖 AI Insights Engine     | Personalized financial recommendations       |
| 📈 Cash Flow Forecasting  | Predict future financial position            |
| 🏷 Expense Categorization | Auto-classify expenses                       |
| ⚠ Risk Detection          | Identify financial vulnerabilities           |
| 🚨 Anomaly Detection      | Detect suspicious or unusual transactions    |
| 🎯 Goal Tracking          | Monitor progress towards financial goals     |
| 🔍 Explainable AI         | Transparent reasoning behind recommendations |
| 🏢 SME Analytics          | Business-specific financial intelligence     |

---

# 🧠 AI Capabilities

## 1️⃣ Cash Flow Forecasting

Uses historical transaction data to estimate future cash flow trends.

### Techniques Used

* Linear Regression
* Moving Averages
* Trend Analysis
* Confidence Intervals

### Forecast Horizons

* 30 Days
* 60 Days
* 90 Days

---

## 2️⃣ Intelligent Expense Categorization

Automatically categorizes expenses into:

* Operations
* Marketing
* Technology
* Utilities
* Rent
* Payroll
* Travel
* Miscellaneous

### NLP-Based Classification

The system analyzes transaction descriptions and assigns categories using intelligent keyword matching and contextual rules.

---

## 3️⃣ Risk Detection Engine

Identifies:

* High spending spikes
* Revenue instability
* Negative cash flow patterns
* Expense volatility
* Financial concentration risks

---

## 4️⃣ Anomaly Detection

Flags unusual transactions such as:

* Unexpected large expenses
* Duplicate transactions
* Abnormal spending behavior
* Potential fraud indicators

---

# 📊 Dashboard Analytics

## Financial KPIs

* Total Income
* Total Expenses
* Net Cash Flow
* Profit Margin
* Growth Rate
* Expense Breakdown

---

## Interactive Visualizations

### Income vs Expense Analysis

Track monthly earnings against expenditures.

### Cash Flow Trend Monitoring

Visualize financial movement over time.

### Expense Distribution

Understand where money is being spent.

### Forecast Dashboard

View projected financial performance.

---

# 🏗 System Architecture

```text
                 ┌───────────────────┐
                 │   User Uploads    │
                 │      CSV File     │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Data Validation   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Data Processing   │
                 └─────────┬─────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼

 ┌────────────┐    ┌────────────┐    ┌────────────┐
 │ Forecasting│    │ Risk Engine│    │Categorizer │
 └────────────┘    └────────────┘    └────────────┘

        ▼                  ▼                  ▼

     ┌────────────────────────────────────┐
     │ AI Recommendation Engine           │
     └────────────────────────────────────┘

                           ▼

               ┌──────────────────┐
               │ Dashboard UI     │
               └──────────────────┘
```

---

# 🛠 Technology Stack

## Frontend

| Technology   | Purpose              |
| ------------ | -------------------- |
| React 18     | UI Framework         |
| TypeScript   | Type Safety          |
| Vite         | Fast Build Tool      |
| TailwindCSS  | Styling              |
| shadcn/ui    | UI Components        |
| Recharts     | Data Visualization   |
| React Query  | API State Management |
| React Router | Routing              |

---

## Backend

| Technology        | Purpose             |
| ----------------- | ------------------- |
| Node.js           | Runtime             |
| Express.js        | REST APIs           |
| TypeScript        | Backend Development |
| Multer            | File Uploads        |
| CSV Parser        | Data Processing     |
| Custom ML Modules | Analytics Engine    |

---

# 📂 Project Structure

```bash
moneymind-ai/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   └── assets/
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── types/
│   │
│   └── package.json
│
├── public/
├── README.md
└── package.json
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone <repository-url>
cd moneymind-ai
```

---

## Install Dependencies

### Frontend

```bash
npm install
```

### Backend

```bash
cd server
npm install
```

---

## Environment Variables

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Run Backend

```bash
cd server
npm run dev
```

Server runs at:

```bash
http://localhost:3001
```

---

## Run Frontend

```bash
npm run dev
```

Application runs at:

```bash
http://localhost:8081
```

---

# 🔌 API Endpoints

## Dashboard

```http
GET /api/dashboard/summary
```

Returns dashboard metrics and financial summaries.

---

## Upload Financial Data

```http
POST /api/upload/csv
```

Uploads transaction data.

---

## Forecasting

```http
POST /api/analysis/forecast
```

Generates future cash flow predictions.

---

## Categorization

```http
POST /api/analysis/categorize
```

Classifies transactions automatically.

---

## Anomaly Detection

```http
POST /api/analysis/anomalies
```

Detects unusual financial activities.

---

## AI Recommendations

```http
POST /api/recommendations
```

Returns personalized recommendations.

---

# 📄 CSV Input Format

```csv
date,description,amount,category
2025-01-15,Client Payment,5000,Sales
2025-01-20,Office Rent,-1200,Operations
2025-01-25,Software License,-99,Technology
```

### Required Fields

| Field       | Description         |
| ----------- | ------------------- |
| date        | YYYY-MM-DD          |
| description | Transaction details |
| amount      | Positive = Income   |
| amount      | Negative = Expense  |
| category    | Optional            |

---

# 📸 Application Screenshots

## Dashboard

```text
Add Dashboard Screenshot Here
```

---

## Forecast Analysis

```text
Add Forecast Screenshot Here
```

---

## Risk Detection

```text
Add Risk Detection Screenshot Here
```

---

# 🎯 Future Roadmap

### Phase 1

* [x] Financial Dashboard
* [x] Forecasting Engine
* [x] Risk Detection
* [x] Expense Categorization

### Phase 2

* [ ] Open Banking Integration
* [ ] PDF Statement Uploads
* [ ] Real-Time Notifications
* [ ] AI Financial Chatbot

### Phase 3

* [ ] Deep Learning Forecast Models
* [ ] Credit Risk Scoring
* [ ] Investment Recommendations
* [ ] Multi-Currency Support

---

# 🔒 Security Considerations

* Input validation
* Secure file uploads
* Type-safe backend architecture
* Error handling middleware
* API request sanitization

---

# 🌟 Why Moneymind AI?

✅ AI-Driven Insights

✅ Financial Risk Intelligence

✅ Cash Flow Prediction

✅ Explainable Recommendations

✅ SME-Friendly Analytics

✅ Interactive Visual Dashboard

---

# 👨‍💻 Contributors

### 🚀 Parthiv Abhani

AI & Backend Development

### 🚀 Aishi De

Frontend Development, Analytics & Product Design

---

# 📜 License

This project is licensed under the MIT License.

---

<p align="center">
  <b>💰 Moneymind AI — Turning Financial Data into Intelligent Decisions.</b>
</p>
