import { createContext, useContext, ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/stripe-stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY || '');

interface PaymentContextType {
  createPaymentIntent: (amount: number, courseId: string) => Promise<{ clientSecret: string }>;
  processPayment: (paymentMethodId: string, courseId: string) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

interface PaymentProviderProps {
  children: ReactNode;
}

export function PaymentProvider({ children }: PaymentProviderProps) {
  const createPaymentIntent = async (amount: number, courseId: string) => {
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ amount, courseId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    return response.json();
  };

  const processPayment = async (paymentMethodId: string, courseId: string) => {
    const response = await fetch('/api/payments/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ paymentMethodId, courseId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process payment');
    }
  };

  const value = {
    createPaymentIntent,
    processPayment,
  };

  return (
    <PaymentContext.Provider value={value}>
      <Elements stripe={stripePromise}>{children}</Elements>
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
} 