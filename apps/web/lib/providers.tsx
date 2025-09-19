'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/lib/hooks/useAuth';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: (failureCount, error: any) => {
                            if (error?.response?.status >= 400 && error?.response?.status < 500) {
                                return false;
                            }
                            return failureCount < 3;
                        },
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: true,
                    },
                    mutations: {
                        retry: (failureCount, error: any) => {
                            if (error?.response?.status >= 400 && error?.response?.status < 500) {
                                return false;
                            }
                            return failureCount < 2;
                        },
                    },
                },
            })
    );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}