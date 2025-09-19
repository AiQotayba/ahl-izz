import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pledgeAPI } from '@/lib/api';

// Query keys
export const pledgeKeys = {
  all: ['pledges'] as const,
  stats: () => [...pledgeKeys.all, 'stats'] as const,
  public: (limit?: number) => [...pledgeKeys.all, 'public', limit] as const,
  list: (params?: any) => [...pledgeKeys.all, 'list', params] as const,
  detail: (id: string) => [...pledgeKeys.all, 'detail', id] as const,
};

// Types
interface Pledge {
  _id: string;
  fullName?: string;
  phoneNumber: string;
  email: string;
  amount: number;
  message?: string;
  pledgeStatus: 'pending' | 'confirmed' | 'rejected';
  paymentMethod?: 'pledged' | 'received';
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalAmount: number;
  donorsCount: number;
  confirmedPledges: number;
  pendingPledges: number;
}

interface PublicPledgesResponse {
  pledges: Pledge[];
  total: number;
  page: number;
  limit: number;
}

// Custom hooks
export function usePledgeStats() {
  return useQuery({
    queryKey: pledgeKeys.stats(),
    queryFn: async (): Promise<Stats> => {
      const response = await pledgeAPI.getStats();
      return response.data.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function usePublicPledges(limit: number = 50) {
  return useQuery({
    queryKey: pledgeKeys.public(limit),
    queryFn: async (): Promise<PublicPledgesResponse> => {
      const response = await pledgeAPI.getPublic(limit);
      return response.data.data;
    },
    staleTime: 15 * 1000, // 15 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

export function useAllPledges(params?: any) {
  return useQuery({
    queryKey: pledgeKeys.list(params),
    queryFn: async () => {
      const response = await pledgeAPI.getAll(params);
      return response.data.data;
    },
    enabled: false, // Only fetch when explicitly called
  });
}

export function usePledgeById(id: string) {
  return useQuery({
    queryKey: pledgeKeys.detail(id),
    queryFn: async (): Promise<Pledge> => {
      const response = await pledgeAPI.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useSubmitPledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pledgeData: any) => {
      const response = await pledgeAPI.submit(pledgeData);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: pledgeKeys.stats() });
      queryClient.invalidateQueries({ queryKey: pledgeKeys.public() });
      queryClient.invalidateQueries({ queryKey: pledgeKeys.list() });
    },
  });
}

export function useUpdatePledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await pledgeAPI.update(id, data);
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific pledge in cache
      queryClient.setQueryData(pledgeKeys.detail(variables.id), data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: pledgeKeys.stats() });
      queryClient.invalidateQueries({ queryKey: pledgeKeys.public() });
      queryClient.invalidateQueries({ queryKey: pledgeKeys.list() });
    },
  });
}

export function useErasePledgePII() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await pledgeAPI.erasePII(id);
      return response.data.data;
    },
    onSuccess: (data, id) => {
      // Update the specific pledge in cache
      queryClient.setQueryData(pledgeKeys.detail(id), data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: pledgeKeys.public() });
      queryClient.invalidateQueries({ queryKey: pledgeKeys.list() });
    },
  });
}

// Derived hooks for specific use cases
export function useLiveDonations() {
  const { data, ...rest } = usePublicPledges(10);
  
  const liveDonations = data?.pledges
    ?.filter((pledge: Pledge) => pledge.pledgeStatus === 'confirmed')
    ?.map((pledge: Pledge) => ({
      _id: pledge._id,
      donorName: pledge.fullName ? `${pledge.fullName} من حلب` : 'مجهول',
      amount: pledge.amount,
      createdAt: pledge.createdAt
    })) || [];

  return {
    data: liveDonations,
    ...rest
  };
}

export function useTopDonations() {
  const { data, ...rest } = usePublicPledges(50);
  
  const topDonations = data?.pledges
    ?.filter((pledge: Pledge) => pledge.pledgeStatus === 'confirmed')
    ?.sort((a: Pledge, b: Pledge) => b.amount - a.amount)
    ?.slice(0, 5)
    ?.map((pledge: Pledge) => ({
      id: pledge._id,
      amount: pledge.amount,
      companyName: pledge.fullName || 'مجهول'
    })) || [];

  return {
    data: topDonations,
    ...rest
  };
}
