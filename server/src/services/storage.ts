import { FinancialTransaction } from './csvParser';

// Simple in-memory storage for demo purposes
// In production, this would be replaced with a proper database
class MemoryStorage {
  private transactions: Map<string, FinancialTransaction[]> = new Map();

  setTransactions(userId: string, transactions: FinancialTransaction[]) {
    this.transactions.set(userId, transactions);
  }

  getTransactions(userId: string): FinancialTransaction[] {
    return this.transactions.get(userId) || [];
  }

  hasTransactions(userId: string): boolean {
    return this.transactions.has(userId) && this.transactions.get(userId)!.length > 0;
  }
}

export const storage = new MemoryStorage();
