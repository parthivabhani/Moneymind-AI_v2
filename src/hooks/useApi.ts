import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiResponse } from '@/lib/api';

// Generic hook for API calls
export function useApiQuery<T>(
  key: string[],
  queryFn: () => Promise<ApiResponse<T>>,
  options?: any
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await queryFn();
      if (!response.success) {
        throw new Error(response.error || 'Request failed');
      }
      return response.data!;
    },
    ...options,
  });
}

// Dashboard hook
export function useDashboardData(userId?: string) {
  return useApiQuery(
    ['dashboard', userId],
    () => apiClient.getDashboardData(userId),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 30 * 1000, // 30 seconds
    }
  );
}

// File upload hook
export function useUploadCSV() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, userId }: { file: File; userId?: string }) =>
      apiClient.uploadCSV(file, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Analysis hooks
export function useGenerateForecast() {
  return useMutation({
    mutationFn: (transactions: any[]) =>
      apiClient.generateForecast(transactions),
  });
}

export function useCategorizeTransactions() {
  return useMutation({
    mutationFn: (transactions: any[]) =>
      apiClient.categorizeTransactions(transactions),
  });
}

export function useDetectAnomalies() {
  return useMutation({
    mutationFn: (transactions: any[]) =>
      apiClient.detectAnomalies(transactions),
  });
}

// Recommendations hooks
export function useRecommendationsData(userId?: string) {
  return useApiQuery(
    ['recommendations', userId],
    () => apiClient.fetchRecommendations(userId),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useRecommendations() {
  return useMutation({
    mutationFn: ({ transactions, goals }: { transactions: any[]; goals?: any[] }) =>
      apiClient.getRecommendations(transactions, goals),
  });
}
