import { FinancialTransaction } from './csvParser';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  transactionCount: number;
  categoryBreakdown: Record<string, number>;
}

export function calculateMetrics(transactions: FinancialTransaction[]): FinancialSummary {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const netCashFlow = totalIncome - totalExpenses;
  
  // Calculate category breakdown (for expenses primarily)
  const categoryBreakdown: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const category = transaction.category || 'Other';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + Math.abs(transaction.amount);
    });
  
  // Convert to percentages
  const totalExpensesForPercent = Object.values(categoryBreakdown).reduce((sum, val) => sum + val, 0);
  if (totalExpensesForPercent > 0) {
    Object.keys(categoryBreakdown).forEach(category => {
      categoryBreakdown[category] = Math.round((categoryBreakdown[category] / totalExpensesForPercent) * 100);
    });
  }
  
  return {
    totalIncome,
    totalExpenses,
    netCashFlow,
    transactionCount: transactions.length,
    categoryBreakdown
  };
}

export function calculateMonthlyMetrics(transactions: FinancialTransaction[]) {
  const monthlyData: Record<string, { income: number; expenses: number; cashFlow: number }> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0, cashFlow: 0 };
    }
    
    const amount = Math.abs(transaction.amount);
    
    if (transaction.type === 'income') {
      monthlyData[monthKey].income += amount;
    } else {
      monthlyData[monthKey].expenses += amount;
    }
  });
  
  // Calculate cash flow for each month
  Object.keys(monthlyData).forEach(month => {
    monthlyData[month].cashFlow = monthlyData[month].income - monthlyData[month].expenses;
  });
  
  return monthlyData;
}
