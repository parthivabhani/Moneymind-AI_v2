import { calculateMonthlyMetrics } from './metricsCalculator';
import { generateForecast } from './forecastService';
import { detectRisks } from './riskAnalyzer';
import { getCategoryColor } from './categorizer';
import { FinancialTransaction } from './csvParser';
import { storage } from './storage';
import { generateExecutiveSummaryLLM } from './aiService';

// Sample data for demo purposes
export const sampleTransactions: FinancialTransaction[] = [
  { date: '2024-07-01', description: 'Client Payment - Project A', amount: 45000, category: 'Sales', type: 'income' },
  { date: '2024-07-15', description: 'Office Rent', amount: -12000, category: 'Operations', type: 'expense' },
  { date: '2024-07-20', description: 'Employee Salaries', amount: -18000, category: 'Payroll', type: 'expense' },
  { date: '2024-07-25', description: 'Marketing Campaign', amount: -8000, category: 'Marketing', type: 'expense' },
  { date: '2024-08-01', description: 'Client Payment - Project B', amount: 52000, category: 'Sales', type: 'income' },
  { date: '2024-08-15', description: 'Office Rent', amount: -12000, category: 'Operations', type: 'expense' },
  { date: '2024-08-20', description: 'Employee Salaries', amount: -18000, category: 'Payroll', type: 'expense' },
  { date: '2024-08-25', description: 'Software Licenses', amount: -6000, category: 'Technology', type: 'expense' },
  { date: '2024-08-28', description: 'Consulting Services', amount: -5000, category: 'Operations', type: 'expense' },
  { date: '2024-09-01', description: 'Client Payment - Project C', amount: 48000, category: 'Sales', type: 'income' },
  { date: '2024-09-15', description: 'Office Rent', amount: -12000, category: 'Operations', type: 'expense' },
  { date: '2024-09-20', description: 'Employee Salaries', amount: -19000, category: 'Payroll', type: 'expense' },
  { date: '2024-09-25', description: 'Equipment Purchase', amount: -8000, category: 'Technology', type: 'expense' },
  { date: '2024-09-28', description: 'Travel Expenses', amount: -5000, category: 'Travel', type: 'expense' },
  { date: '2024-10-01', description: 'Client Payment - Project D', amount: 61000, category: 'Sales', type: 'income' },
  { date: '2024-10-15', description: 'Office Rent', amount: -12000, category: 'Operations', type: 'expense' },
  { date: '2024-10-20', description: 'Employee Salaries', amount: -20000, category: 'Payroll', type: 'expense' },
  { date: '2024-10-25', description: 'Marketing Campaign', amount: -8000, category: 'Marketing', type: 'expense' },
  { date: '2024-10-28', description: 'Insurance Premium', amount: -3000, category: 'Insurance', type: 'expense' },
  { date: '2024-10-30', description: 'Utilities', amount: -4000, category: 'Operations', type: 'expense' },
  { date: '2024-11-01', description: 'Client Payment - Project E', amount: 55000, category: 'Sales', type: 'income' },
  { date: '2024-11-15', description: 'Office Rent', amount: -12000, category: 'Operations', type: 'expense' },
  { date: '2024-11-20', description: 'Employee Salaries', amount: -21000, category: 'Payroll', type: 'expense' },
  { date: '2024-11-25', description: 'Software Licenses', amount: -7000, category: 'Technology', type: 'expense' },
  { date: '2024-11-28', description: 'Professional Services', amount: -8000, category: 'Operations', type: 'expense' },
  { date: '2024-11-30', description: 'Bank Fees', amount: -2000, category: 'Banking', type: 'expense' },
  { date: '2024-12-01', description: 'Client Payment - Project F', amount: 67000, category: 'Sales', type: 'income' },
  { date: '2024-12-15', description: 'Office Rent', amount: -13000, category: 'Operations', type: 'expense' },
  { date: '2024-12-20', description: 'Employee Salaries', amount: -22000, category: 'Payroll', type: 'expense' },
  { date: '2024-12-25', description: 'Marketing Campaign', amount: -9000, category: 'Marketing', type: 'expense' },
  { date: '2024-12-28', description: 'Technology Investment', amount: -8000, category: 'Technology', type: 'expense' },
  { date: '2024-12-30', description: 'Year-end Bonus', amount: -6000, category: 'Payroll', type: 'expense' }
];

export async function getDashboardData(userId: string) {
  const isDemoData = userId === 'demo';
  const hasData = isDemoData || storage.hasTransactions(userId);

  if (!hasData) {
    return {
      hasData: false,
      isDemoData: false,
      metricCards: [],
      chartData: [],
      expenseCategories: [],
      forecast: [],
      riskIndicators: []
    };
  }

  // Check if user has uploaded data, otherwise use sample data if it's demo mode
  const transactions = storage.hasTransactions(userId) 
    ? storage.getTransactions(userId) 
    : sampleTransactions;
  
  const monthlyData = calculateMonthlyMetrics(transactions);
  
  // Convert to chart format
  const chartData = Object.entries(monthlyData).map(([month, data]) => ({
    month: month.split(' ')[0],
    income: data.income,
    expenses: data.expenses,
    cashFlow: data.cashFlow
  }));
  
  // Calculate current month metrics
  const currentMonth = Object.values(monthlyData).slice(-1)[0];
  const previousMonth = Object.values(monthlyData).slice(-2)[0];
  
  const metricCards = [
    {
      title: "Total Income",
      value: `$${currentMonth.income.toLocaleString()}`,
      change: previousMonth ? `+${((currentMonth.income - previousMonth.income) / previousMonth.income * 100).toFixed(1)}%` : "+0%",
      trend: "up" as const,
      description: "vs last month",
      icon: "DollarSign"
    },
    {
      title: "Total Expenses",
      value: `$${currentMonth.expenses.toLocaleString()}`,
      change: previousMonth ? `+${((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses * 100).toFixed(1)}%` : "+0%",
      trend: "up" as const,
      description: "vs last month",
      icon: "TrendingDown"
    },
    {
      title: "Net Cash Flow",
      value: `$${currentMonth.cashFlow.toLocaleString()}`,
      change: previousMonth ? `+${((currentMonth.cashFlow - previousMonth.cashFlow) / Math.abs(previousMonth.cashFlow || 1) * 100).toFixed(1)}%` : "+0%",
      trend: currentMonth.cashFlow >= 0 ? "up" as const : "down" as const,
      description: "vs last month",
      icon: "TrendingUp"
    },
    {
      title: "Profit Margin",
      value: `${(currentMonth.income > 0 ? (currentMonth.cashFlow / currentMonth.income * 100) : 0).toFixed(1)}%`,
      change: "+5.2%",
      trend: "up" as const,
      description: "vs last month",
      icon: "ArrowUpRight"
    }
  ];
  
  // Expense categories
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const category = t.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(t.amount);
    });
  
  const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  const expenseCategories = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Math.round((value / totalExpenses) * 100),
    color: getCategoryColor(name)
  }));
  
  // Forecast data
  const forecast = await generateForecast(transactions);
  
  // Risk indicators
  const risks = await detectRisks(transactions);

  // Generate Generative AI Summary
  const executiveSummary = await generateExecutiveSummaryLLM(metricCards, risks);
  
  return {
    hasData: true,
    isDemoData,
    executiveSummary,
    metricCards,
    chartData,
    expenseCategories,
    forecast,
    riskIndicators: risks
  };
}

async function fetchUserTransactions(userId: string): Promise<FinancialTransaction[]> {
  // In production, fetch from database
  return [];
}
