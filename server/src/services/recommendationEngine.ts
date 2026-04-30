import { FinancialTransaction } from './csvParser';
import { calculateMonthlyMetrics } from './metricsCalculator';
import { detectRisks } from './riskAnalyzer';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'cost_reduction' | 'revenue_growth' | 'cash_flow' | 'risk_management';
  impact: {
    savings?: number;
    timeframe: string;
    confidence: number;
  };
  actionItems: string[];
  reasoning: string;
}

export async function generateRecommendations(
  transactions: FinancialTransaction[], 
  goals?: any[]
): Promise<Recommendation[]> {
  
  const recommendations: Recommendation[] = [];
  const monthlyData = calculateMonthlyMetrics(transactions);
  const risks = await detectRisks(transactions);
  
  // Analyze expense patterns
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const categoryTotals: Record<string, number> = {};
  
  expenseTransactions.forEach(t => {
    const category = t.category || 'Other';
    categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(t.amount);
  });
  
  const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  // Cost reduction recommendations
  Object.entries(categoryTotals).forEach(([category, amount]) => {
    const percentage = (amount / totalExpenses) * 100;
    
    if (percentage > 30 && category !== 'Payroll') {
      recommendations.push({
        id: `cost_reduction_${category}`,
        title: `Optimize ${category} Expenses`,
        description: `${category} represents ${percentage.toFixed(1)}% of total expenses. Consider optimization strategies.`,
        priority: 'high',
        category: 'cost_reduction',
        impact: {
          savings: amount * 0.15, // Potential 15% savings
          timeframe: '3 months',
          confidence: 0.7
        },
        actionItems: [
          `Review ${category.toLowerCase()} line items for inefficiencies`,
          'Negotiate with vendors for better rates',
          'Explore alternative solutions or providers'
        ],
        reasoning: `High concentration in ${category} suggests potential for cost optimization through vendor negotiation and process improvement.`
      });
    }
  });
  
  // Cash flow recommendations
  const cashFlowValues = Object.values(monthlyData).map(m => m.cashFlow);
  const avgCashFlow = cashFlowValues.reduce((sum, cf) => sum + cf, 0) / cashFlowValues.length;
  
  if (avgCashFlow < 0) {
    recommendations.push({
      id: 'cash_flow_negative',
      title: 'Address Negative Cash Flow',
      description: 'Average monthly cash flow is negative. Immediate action required.',
      priority: 'high',
      category: 'cash_flow',
      impact: {
        timeframe: '1 month',
        confidence: 0.9
      },
      actionItems: [
        'Review and reduce discretionary expenses',
        'Accelerate accounts receivable collection',
        'Consider short-term financing options',
        'Renegotiate payment terms with suppliers'
      ],
      reasoning: 'Consistent negative cash flow threatens business sustainability and requires immediate corrective action.'
    });
  } else if (avgCashFlow < totalExpenses * 0.1) {
    recommendations.push({
      id: 'cash_flow_low',
      title: 'Improve Cash Flow Buffer',
      description: 'Cash flow margin is thin. Build stronger financial reserves.',
      priority: 'medium',
      category: 'cash_flow',
      impact: {
        timeframe: '6 months',
        confidence: 0.8
      },
      actionItems: [
        'Establish minimum cash reserve target',
        'Implement cash flow forecasting',
        'Optimize payment timing',
        'Consider revolving credit facility'
      ],
      reasoning: 'Thin cash flow margins create vulnerability to unexpected expenses or revenue disruptions.'
    });
  }
  
  // Revenue growth recommendations
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const incomeBySource: Record<string, number> = {};
  
  incomeTransactions.forEach(t => {
    const source = extractSourceFromDescription(t.description);
    incomeBySource[source] = (incomeBySource[source] || 0) + t.amount;
  });
  
  const totalIncome = Object.values(incomeBySource).reduce((sum, val) => sum + val, 0);
  const maxSource = Math.max(...Object.values(incomeBySource));
  const concentration = (maxSource / totalIncome) * 100;
  
  if (concentration > 70) {
    recommendations.push({
      id: 'revenue_diversification',
      title: 'Diversify Revenue Sources',
      description: `${concentration.toFixed(1)}% of revenue comes from single source. Diversification recommended.`,
      priority: 'medium',
      category: 'revenue_growth',
      impact: {
        timeframe: '12 months',
        confidence: 0.6
      },
      actionItems: [
        'Identify new market segments',
        'Develop additional products/services',
        'Expand customer acquisition channels',
        'Create recurring revenue models'
      ],
      reasoning: 'High revenue concentration increases business risk and limits growth potential.'
    });
  }
  
  // Risk management recommendations based on detected risks
  risks.forEach(risk => {
    if (risk.status === 'warning' || risk.status === 'danger') {
      recommendations.push({
        id: `risk_${risk.title.toLowerCase().replace(/\s+/g, '_')}`,
        title: `Address ${risk.title}`,
        description: risk.message,
        priority: risk.status === 'danger' ? 'high' : 'medium',
        category: 'risk_management',
        impact: {
          timeframe: '3 months',
          confidence: 0.7
        },
        actionItems: [
          'Implement monitoring alerts',
          'Create mitigation strategies',
          'Review and adjust financial policies',
          'Consider professional consultation'
        ],
        reasoning: risk.message
      });
    }
  });
  
  // Sort by priority and impact
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function extractSourceFromDescription(description: string): string {
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
