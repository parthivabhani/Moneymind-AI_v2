import { FinancialTransaction } from './csvParser';
import { categorizeTransaction } from './categorizer';
import { calculateMetrics } from './metricsCalculator';

export interface ProcessedData {
  transactions: FinancialTransaction[];
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    transactionCount: number;
    categoryBreakdown: Record<string, number>;
  };
}

export async function processFinancialData(
  transactions: FinancialTransaction[], 
  userId: string
): Promise<ProcessedData> {
  
  let partiallyCategorized = transactions;
  
  // Run AI Batch Categorization
  try {
    const aiService = await import('./aiService');
    partiallyCategorized = await aiService.batchCategorizeTransactionsLLM(transactions);
  } catch(e) {
    console.error("AI Categorizer unavailable, using deterministic heuristics", e);
  }

  // Add heuristic categories as fallback to any remaining uncategorized
  const categorizedTransactions = partiallyCategorized.map(transaction => ({
    ...transaction,
    category: transaction.category || categorizeTransaction(transaction.description)
  }));
  
  // Sort by date
  categorizedTransactions.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate date range
  const dates = categorizedTransactions.map(t => t.date);
  const dateRange = {
    start: dates[0] || new Date().toISOString().split('T')[0],
    end: dates[dates.length - 1] || new Date().toISOString().split('T')[0]
  };
  
  // Calculate summary metrics
  const summary = calculateMetrics(categorizedTransactions);
  
  return {
    transactions: categorizedTransactions,
    dateRange,
    summary
  };
}
