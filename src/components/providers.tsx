import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { PaymentProvider } from '@/features/payment/context/PaymentContext';
import { StripeProvider } from '@/features/payment/components/StripeProvider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaymentProvider>
          <StripeProvider>
            {children}
          </StripeProvider>
        </PaymentProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
} 