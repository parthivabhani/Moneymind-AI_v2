import { FinancialTransaction } from './csvParser';
import { calculateMonthlyMetrics } from './metricsCalculator';

export interface ForecastData {
  period: string;
  cashFlow: number;
  type: 'actual' | 'forecast';
}

export async function generateForecast(transactions: FinancialTransaction[]): Promise<ForecastData[]> {
  const monthlyData = calculateMonthlyMetrics(transactions);
  const months = Object.entries(monthlyData);
  
  if (months.length < 3) {
    // Not enough data for meaningful forecast
    return months.map(([month, data]) => ({
      period: `${month} (Actual)`,
      cashFlow: data.cashFlow,
      type: 'actual' as const
    }));
  }
  
  // Simple moving average forecast
  const lastThreeMonths = months.slice(-3);
  const avgCashFlow = lastThreeMonths.reduce((sum, [, data]) => sum + data.cashFlow, 0) / 3;
  
  // Calculate trend
  const recentTrend = (lastThreeMonths[2][1].cashFlow - lastThreeMonths[0][1].cashFlow) / 2;
  
  // Generate forecast for next 3 months
  const forecast: ForecastData[] = [];
  
  // Add actual data
  months.forEach(([month, data]) => {
    forecast.push({
      period: `${month} (Actual)`,
      cashFlow: data.cashFlow,
      type: 'actual'
    });
  });
  
  // Add forecast data
  const lastMonth = months[months.length - 1][0];
  const forecastPeriods = ['Jan', 'Feb', 'Mar'];
  
  forecastPeriods.forEach((period, index) => {
    const forecastValue = avgCashFlow + (recentTrend * (index + 1));
    forecast.push({
      period: `${period} (${(index + 1) * 30}d)`,
      cashFlow: Math.round(forecastValue),
      type: 'forecast'
    });
  });
  
  return forecast.slice(-4); // Return last actual + 3 forecasts
}

// More sophisticated forecasting using linear regression
export function linearRegressionForecast(data: number[]): number[] {
  const n = data.length;
  if (n < 2) return data;
  
  // Calculate linear regression parameters
  const x = Array.from({ length: n }, (_, i) => i);
  const y = data;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Generate forecast for next 3 periods
  const forecast = [];
  for (let i = 0; i < 3; i++) {
    const nextX = n + i;
    const forecastValue = slope * nextX + intercept;
    forecast.push(Math.round(forecastValue));
  }
  
  return forecast;
}
