import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { PaymentProvider } from '@/features/payment/context/PaymentContext';
import { StripeProvider } from '@/features/payment/components/StripeProvider';
import { ReactNode } from 'react';
import { CartProvider } from '@/contexts/CartContext';

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaymentProvider>
          <StripeProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </StripeProvider>
        </PaymentProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
} 