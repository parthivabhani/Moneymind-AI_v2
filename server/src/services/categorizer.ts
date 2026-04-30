// Simple rule-based transaction categorizer
// In production, this would use NLP models

const categoryRules = {
  // Income categories
  'Salary': ['salary', 'payroll', 'wage', 'income', 'payment'],
  'Sales': ['sale', 'revenue', 'customer', 'invoice', 'payment received'],
  'Investment': ['dividend', 'interest', 'investment', 'return', 'capital gain'],
  'Freelance': ['freelance', 'contract', 'consulting', 'project'],
  
  // Expense categories
  'Operations': ['rent', 'utilities', 'office', 'supplies', 'maintenance'],
  'Payroll': ['salary', 'payroll', 'wage', 'employee', 'contractor'],
  'Marketing': ['advertising', 'marketing', 'promotion', 'social media', 'google'],
  'Technology': ['software', 'hardware', 'subscription', 'saas', 'tech'],
  'Travel': ['travel', 'flight', 'hotel', 'uber', 'taxi', 'gas'],
  'Food': ['restaurant', 'food', 'coffee', 'meal', 'catering'],
  'Insurance': ['insurance', 'premium', 'coverage'],
  'Taxes': ['tax', 'irs', 'government', 'filing'],
  'Banking': ['bank fee', 'interest charge', 'loan payment', 'credit card'],
  'Other': []
};

export function categorizeTransaction(description: string): string {
  const lowerDesc = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryRules)) {
    if (category === 'Other') continue;
    
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

export function categorizeTransactions(transactions: any[]): any[] {
  return transactions.map(transaction => ({
    ...transaction,
    category: transaction.category || categorizeTransaction(transaction.description)
  }));
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Salary': 'hsl(173, 58%, 39%)',
    'Sales': 'hsl(173, 58%, 55%)',
    'Investment': 'hsl(173, 58%, 70%)',
    'Freelance': 'hsl(215, 16%, 47%)',
    'Operations': 'hsl(0, 84%, 60%)',
    'Payroll': 'hsl(30, 84%, 60%)',
    'Marketing': 'hsl(280, 84%, 60%)',
    'Technology': 'hsl(200, 84%, 60%)',
    'Travel': 'hsl(120, 84%, 60%)',
    'Food': 'hsl(45, 84%, 60%)',
    'Insurance': 'hsl(320, 84%, 60%)',
    'Taxes': 'hsl(60, 84%, 60%)',
    'Banking': 'hsl(160, 84%, 60%)',
    'Other': 'hsl(214, 32%, 91%)'
  };
  
  return colors[category] || colors['Other'];
}
