import { Readable } from 'stream';

export interface FinancialTransaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
  type: 'income' | 'expense';
  account?: string;
}

export function parseCSV(buffer: Buffer): FinancialTransaction[] {
  const csvData = buffer.toString('utf-8');
  const lines = csvData.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const dataRows = lines.slice(1);

  // Find column indices - very flexible matching
  const dateIndex = headers.findIndex(h => h.includes('date'));
  const descriptionIndex = headers.findIndex(h => h.includes('description') || h.includes('desc'));
  const amountIndex = headers.findIndex(h => h.includes('amount'));
  const categoryIndex = headers.findIndex(h => h.includes('category') || h.includes('cat'));
  const accountIndex = headers.findIndex(h => h.includes('account'));

  if (dateIndex === -1 || descriptionIndex === -1 || amountIndex === -1) {
    throw new Error('CSV must contain date, description, and amount columns');
  }

  const transactions: FinancialTransaction[] = [];

  dataRows.forEach((line) => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));

    try {
      const transaction: Partial<FinancialTransaction> = {};

      transaction.date = values[dateIndex];
      transaction.description = values[descriptionIndex];
      transaction.amount = parseFloat(values[amountIndex]) || 0;

      // Handle category - more flexible
      if (categoryIndex !== -1) {
        const categoryValue = values[categoryIndex];
        if (categoryValue.toLowerCase() === 'income' || categoryValue.toLowerCase() === 'expense') {
          transaction.type = categoryValue.toLowerCase() as 'income' | 'expense';
        } else {
          transaction.category = categoryValue;
        }
      }

      // Auto-detect type if not specified
      if (!transaction.type) {
        transaction.type = transaction.amount! >= 0 ? 'income' : 'expense';
      }

      // Validate required fields
      if (transaction.date && transaction.description && transaction.amount) {
        transactions.push(transaction as FinancialTransaction);
      }
    } catch (error) {
      console.warn(`Skipping invalid row: ${line}`);
    }
  });

  return transactions;
}
