import { FinancialTransaction } from './csvParser';
import { calculateMonthlyMetrics } from './metricsCalculator';

export interface RiskIndicator {
  title: string;
  status: 'success' | 'warning' | 'danger';
  message: string;
  trend: string;
}

export async function detectRisks(transactions: FinancialTransaction[]): Promise<RiskIndicator[]> {
  const monthlyData = calculateMonthlyMetrics(transactions);
  const months = Object.entries(monthlyData);
  const risks: RiskIndicator[] = [];
  
  if (months.length < 2) {
    return [{
      title: "Data Insufficient",
      status: "warning",
      message: "Need more historical data for accurate risk assessment.",
      trend: "Limited"
    }];
  }
  
  // Analyze expense volatility
  const expenses = months.map(([, data]) => data.expenses);
  const avgExpense = expenses.reduce((sum, exp) => sum + exp, 0) / expenses.length;
  const lastExpense = expenses[expenses.length - 1];
  const expenseChange = ((lastExpense - avgExpense) / avgExpense) * 100;
  
  if (Math.abs(expenseChange) > 15) {
    risks.push({
      title: "Expense Volatility",
      status: "warning",
      message: `Expenses increased by ${expenseChange.toFixed(1)}% compared to average. Review spending patterns.`,
      trend: `${expenseChange > 0 ? '+' : ''}${expenseChange.toFixed(1)}%`
    });
  } else {
    risks.push({
      title: "Expense Stability",
      status: "success",
      message: "Expense levels remain stable and predictable.",
      trend: "Stable"
    });
  }
  
  // Analyze cash flow consistency
  const cashFlows = months.map(([, data]) => data.cashFlow);
  const positiveCashFlowMonths = cashFlows.filter(cf => cf > 0).length;
  const cashFlowConsistency = (positiveCashFlowMonths / cashFlows.length) * 100;
  
  if (cashFlowConsistency >= 80) {
    risks.push({
      title: "Cash Flow Stability",
      status: "success",
      message: `Positive cash flow maintained for ${positiveCashFlowMonths} consecutive months. Strong financial position.`,
      trend: "Stable"
    });
  } else if (cashFlowConsistency >= 60) {
    risks.push({
      title: "Cash Flow Concern",
      status: "warning",
      message: `Positive cash flow only ${positiveCashFlowMonths} of ${cashFlows.length} months. Monitor closely.`,
      trend: "Variable"
    });
  } else {
    risks.push({
      title: "Cash Flow Risk",
      status: "danger",
      message: `Negative cash flow in ${cashFlows.length - positiveCashFlowMonths} months. Immediate action required.`,
      trend: "Critical"
    });
  }
  
  // Analyze revenue growth
  const incomes = months.map(([, data]) => data.income);
  const recentGrowth = calculateGrowthRate(incomes.slice(-3));
  
  if (recentGrowth > 10) {
    risks.push({
      title: "Revenue Growth",
      status: "success",
      message: `Strong revenue growth of ${recentGrowth.toFixed(1)}% over recent months.`,
      trend: `+${recentGrowth.toFixed(1)}%`
    });
  } else if (recentGrowth > 0) {
    risks.push({
      title: "Revenue Trend",
      status: "success",
      message: `Modest revenue growth of ${recentGrowth.toFixed(1)}%. Continue current strategy.`,
      trend: `+${recentGrowth.toFixed(1)}%`
    });
  } else {
    risks.push({
      title: "Revenue Decline",
      status: "warning",
      message: `Revenue declined by ${Math.abs(recentGrowth).toFixed(1)}%. Review sales strategy.`,
      trend: `${recentGrowth.toFixed(1)}%`
    });
  }
  
  // Check for concentration risk (too much revenue from few sources)
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const incomeBySource: Record<string, number> = {};
  
  incomeTransactions.forEach(t => {
    const source = extractSourceFromDescription(t.description);
    incomeBySource[source] = (incomeBySource[source] || 0) + t.amount;
  });
  
  const totalIncome = Object.values(incomeBySource).reduce((sum, val) => sum + val, 0);
  const maxSourcePercentage = Math.max(...Object.values(incomeBySource)) / totalIncome * 100;
  
  if (maxSourcePercentage > 70) {
    risks.push({
      title: "Revenue Concentration",
      status: "warning",
      message: `${maxSourcePercentage.toFixed(1)}% of revenue comes from single source. Diversification recommended.`,
      trend: "High Risk"
    });
  }
  
  return risks;
}

function calculateGrowthRate(values: number[]): number {
  if (values.length < 2) return 0;
  
  const first = values[0];
  const last = values[values.length - 1];
  
  if (first === 0) return 0;
  
  return ((last - first) / first) * 100;
}

function extractSourceFromDescription(description: string): string {
  // Simple extraction - in production, use NLP
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('client') || lowerDesc.includes('customer')) {
    return 'Client Revenue';
  } else if (lowerDesc.includes('project')) {
    return 'Project Revenue';
  } else if (lowerDesc.includes('investment') || lowerDesc.includes('dividend')) {
    return 'Investment Income';
  } else if (lowerDesc.includes('salary') || lowerDesc.includes('wage')) {
    return 'Employment Income';
  } else {
    return 'Other Revenue';
  }
}
