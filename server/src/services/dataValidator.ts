import { FinancialTransaction } from './csvParser';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateFinancialData(data: FinancialTransaction[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!data || data.length === 0) {
    errors.push('No data provided');
    return { isValid: false, errors, warnings };
  }
  
  // Check required fields
  data.forEach((transaction, index) => {
    if (!transaction.date) {
      errors.push(`Row ${index + 1}: Missing date`);
    } else {
      // Validate date format (YYYY-MM-DD) - accept future dates
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(transaction.date)) {
        errors.push(`Invalid date format: ${transaction.date}`);
      }
    }
    
    if (!transaction.description) {
      errors.push(`Row ${index + 1}: Missing description`);
    }
    
    if (transaction.amount === undefined || transaction.amount === null) {
      errors.push(`Row ${index + 1}: Missing amount`);
    }
    
    if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
      errors.push(`Row ${index + 1}: Invalid amount format`);
    }
    
    if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
      errors.push(`Row ${index + 1}: Invalid transaction type`);
    }
  });
  
  // Data quality checks
  const dateFormats = data.map(t => t.date).filter(Boolean);
  const uniqueDates = new Set(dateFormats);
  if (uniqueDates.size < 2) {
    warnings.push('Data contains limited date range');
  }
  
  const totalIncome = data
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const totalExpenses = data
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  if (totalIncome === 0 && totalExpenses > 0) {
    warnings.push('Data contains only expenses, no income detected');
  }
  
  if (totalExpenses === 0 && totalIncome > 0) {
    warnings.push('Data contains only income, no expenses detected');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
