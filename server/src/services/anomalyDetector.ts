import { FinancialTransaction } from './csvParser';

export interface Anomaly {
  id: string;
  type: 'expense_spike' | 'unusual_category' | 'duplicate_transaction' | 'cash_flow_drop';
  severity: 'low' | 'medium' | 'high';
  description: string;
  amount?: number;
  date?: string;
  recommendation?: string;
}

export async function detectAnomalies(transactions: FinancialTransaction[]): Promise<Anomaly[]> {
  const anomalies: Anomaly[] = [];
  
  if (transactions.length < 5) {
    return anomalies;
  }
  
  // Detect expense spikes
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const avgExpense = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / expenseTransactions.length;
  const threshold = avgExpense * 2.5;
  
  expenseTransactions.forEach(transaction => {
    if (Math.abs(transaction.amount) > threshold) {
      anomalies.push({
        id: `expense_spike_${transaction.date}_${Math.random()}`,
        type: 'expense_spike',
        severity: 'high',
        description: `Unusually large expense: ${transaction.description}`,
        amount: transaction.amount,
        date: transaction.date,
        recommendation: 'Review this transaction for potential errors or unauthorized charges'
      });
    }
  });
  
  // Detect unusual categories
  const categoryFrequency: Record<string, number> = {};
  transactions.forEach(t => {
    const category = t.category || 'Other';
    categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
  });
  
  const totalTransactions = transactions.length;
  Object.entries(categoryFrequency).forEach(([category, count]) => {
    if (count === 1 && category !== 'Other') {
      const transaction = transactions.find(t => t.category === category);
      if (transaction) {
        anomalies.push({
          id: `unusual_category_${category}_${Math.random()}`,
          type: 'unusual_category',
          severity: 'low',
          description: `One-time category: ${category}`,
          date: transaction.date,
          recommendation: 'Consider if this is a recurring expense or a one-time cost'
        });
      }
    }
  });
  
  // Detect potential duplicates
  const transactionMap = new Map<string, FinancialTransaction[]>();
  
  transactions.forEach(transaction => {
    const key = `${Math.abs(transaction.amount)}_${transaction.description.toLowerCase()}`;
    if (!transactionMap.has(key)) {
      transactionMap.set(key, []);
    }
    transactionMap.get(key)!.push(transaction);
  });
  
  transactionMap.forEach((similarTransactions, key) => {
    if (similarTransactions.length > 1) {
      const dates = similarTransactions.map(t => t.date).sort();
      for (let i = 1; i < dates.length; i++) {
        const date1 = new Date(dates[i - 1]);
        const date2 = new Date(dates[i]);
        const daysDiff = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff <= 3) {
          anomalies.push({
            id: `duplicate_${key}_${Math.random()}`,
            type: 'duplicate_transaction',
            severity: 'medium',
            description: `Possible duplicate transaction: ${similarTransactions[0].description}`,
            amount: similarTransactions[0].amount,
            date: dates[i],
            recommendation: 'Verify if this is a duplicate charge or legitimate separate transaction'
          });
        }
      }
    }
  });
  
  // Detect cash flow drops
  const monthlyCashFlow = calculateMonthlyCashFlow(transactions);
  const cashFlowValues = Object.values(monthlyCashFlow);
  
  if (cashFlowValues.length >= 3) {
    const recentTrend = cashFlowValues.slice(-3);
    const avgRecent = recentTrend.reduce((sum, val) => sum + val, 0) / 3;
    const previousAvg = cashFlowValues.slice(-6, -3).reduce((sum, val) => sum + val, 0) / Math.min(3, cashFlowValues.length - 3);
    
    if (avgRecent < previousAvg * 0.5) {
      anomalies.push({
        id: `cash_flow_drop_${Math.random()}`,
        type: 'cash_flow_drop',
        severity: 'high',
        description: `Significant cash flow drop detected`,
        recommendation: 'Investigate causes of reduced cash flow and implement corrective measures'
      });
    }
  }
  
  return anomalies;
}

function calculateMonthlyCashFlow(transactions: FinancialTransaction[]): Record<string, number> {
  const monthlyData: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = 0;
    }
    
    monthlyData[monthKey] += transaction.amount;
  });
  
  return monthlyData;
}
