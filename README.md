# Moneymind AI - AI-Powered Financial Analysis Platform

A comprehensive financial analysis system that provides AI-driven insights, cash flow forecasting, expense categorization, and risk detection for individuals and small businesses.

## 🚀 Features

### Core Functionality
- **Financial Data Ingestion**: CSV file upload with automatic parsing and validation
- **Real-time Dashboard**: Interactive charts showing income, expenses, and cash flow trends
- **AI-Powered Analysis**: Automated insights and recommendations
- **Cash Flow Forecasting**: 30/60/90 day predictions using ML models
- **Expense Categorization**: Automatic categorization using NLP techniques
- **Risk Detection**: Early warning system for financial risks
- **Anomaly Detection**: Identifies unusual transactions and potential fraud

### Advanced Features
- **Explainable AI**: Clear reasoning behind all recommendations
- **Goal-based Planning**: Set and track financial goals
- **SME-focused Insights**: Profit per product, working capital analysis
- **Interactive Visualizations**: Comprehensive charts and dashboards

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **shadcn/ui** components
- **Recharts** for data visualization
- **React Query** for state management
- **React Router** for navigation

### Backend
- **Node.js** with Express and TypeScript
- **Multer** for file uploads
- **CSV Parser** for data processing
- **ML Algorithms** for forecasting and 
- **Error Handling** and validation

### AI/ML Models
- **Time Series Forecasting**: Linear regression and moving averages
- **Expense Categorization**: Rule-based NLP system
- **Risk Analysis**: Statistical anomaly detection
- **Recommendation Engine**: Pattern-based insights

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd moneymind-ai-main
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Environment Setup

Create environment files:

**Backend (server/.env):**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Start Development Servers

**Start Backend:**
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:3001`

**Start Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:8081` (or next available port)

### 5. Access the Application

Open your browser and navigate to `http://localhost:8081`

## 📊 API Endpoints

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard data and metrics

### File Upload
- `POST /api/upload/csv` - Upload CSV financial data

### Analysis
- `POST /api/analysis/forecast` - Generate cash flow forecasts
- `POST /api/analysis/categorize` - Categorize transactions
- `POST /api/analysis/anomalies` - Detect anomalous transactions

### Recommendations
- `POST /api/recommendations` - Get AI-powered recommendations

## 📁 CSV Format

Upload CSV files with the following columns:

```csv
date,description,amount,category
2024-01-15,Client Payment,5000,Sales
2024-01-20,Office Rent,-1200,Operations
2024-01-25,Software License,-99,Technology
```

**Required Fields:**
- `date`: Transaction date (YYYY-MM-DD format)
- `description`: Transaction description
- `amount`: Transaction amount (positive for income, negative for expenses)
- `category`: Optional category (auto-assigned if not provided)

## 🤖 AI Models

### Cash Flow Forecasting
- Uses historical data patterns
- Linear regression for trend analysis
- Seasonal adjustments
- Confidence intervals

### Expense Categorization
- Rule-based keyword matching
- Context-aware classification
- Custom category learning
- Fallback to "Other" category

### Risk Detection
- Expense volatility analysis
- Cash flow consistency monitoring
- Revenue concentration analysis
- Anomaly detection algorithms

## 📈 Dashboard Features

### Metric Cards
- Total Income with month-over-month change
- Total Expenses with trend analysis
- Net Cash Flow with percentage change
- Profit Margin calculation

### Interactive Charts
- Income vs Expenses bar chart
- Cash flow trend area chart
- Expense category pie chart
- Forecast visualization

### Risk Indicators
- Real-time risk assessment
- Color-coded severity levels
- Actionable recommendations
- Trend monitoring

## 🔧 Development

### Project Structure
```
clarity-finance-main/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and API client
│   └── services/          # Frontend services
├── server/                # Backend source
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── types/         # TypeScript types
│   └── package.json
└── README.md
```

### Adding New Features

1. **Backend**: Add services in `server/src/services/`
2. **API Routes**: Create routes in `server/src/routes/`
3. **Frontend**: Add components in `src/components/`
4. **State Management**: Use React Query hooks in `src/hooks/`

Contributor : 
Parthiv Abhani 
Aishi De

