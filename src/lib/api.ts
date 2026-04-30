const isProduction = import.meta.env.PROD;
const API_BASE_URL = isProduction 
  ? 'https://moneymind-ai-production.up.railway.app/api'
  : 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FinancialTransaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
  type: 'income' | 'expense';
}

export interface DashboardData {
  hasData?: boolean;
  isDemoData?: boolean;
  executiveSummary?: string;
  metricCards: Array<{
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    description: string;
    icon: string;
  }>;
  chartData: Array<{
    month: string;
    income: number;
    expenses: number;
    cashFlow: number;
  }>;
  expenseCategories: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  forecast: Array<{
    period: string;
    cashFlow: number;
    type: 'actual' | 'forecast';
  }>;
  riskIndicators: Array<{
    title: string;
    status: 'success' | 'warning' | 'danger';
    message: string;
    trend: string;
  }>;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Dashboard API
  async getDashboardData(userId?: string): Promise<ApiResponse<DashboardData>> {
    const params = userId ? `?userId=${userId}` : '';
    return this.request<DashboardData>(`/dashboard/summary${params}`);
  }

  // File Upload API
  async uploadCSV(file: File, userId?: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) formData.append('userId', userId);

    return this.request('/upload/csv', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it with boundary
    });
  }

  // Analysis API
  async generateForecast(transactions: FinancialTransaction[]): Promise<ApiResponse<any>> {
    return this.request('/analysis/forecast', {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    });
  }

  async categorizeTransactions(transactions: FinancialTransaction[]): Promise<ApiResponse<any>> {
    return this.request('/analysis/categorize', {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    });
  }

  async detectAnomalies(transactions: FinancialTransaction[]): Promise<ApiResponse<any>> {
    return this.request('/analysis/anomalies', {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    });
  }

  // Recommendations API
  async fetchRecommendations(userId?: string): Promise<ApiResponse<any>> {
    const params = userId ? `?userId=${userId}` : '';
    return this.request(`/recommendations${params}`);
  }

  async getRecommendations(
    transactions: FinancialTransaction[],
    goals?: any[]
  ): Promise<ApiResponse<any>> {
    return this.request('/recommendations', {
      method: 'POST',
      body: JSON.stringify({ transactions, goals }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health', { method: 'GET' });
  }
}

export const apiClient = new ApiClient();
