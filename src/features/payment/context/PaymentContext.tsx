import { createContext, useContext } from 'react';

interface PaymentContextType {
  createPaymentIntent: (amount: number, courseId: string) => Promise<{ clientSecret: string }>;
  processPayment: (paymentMethodId: string, courseId: string) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const createPaymentIntent = async (amount: number, courseId: string) => {
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, courseId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return response.json();
  };

  const processPayment = async (paymentMethodId: string, courseId: string) => {
    const response = await fetch('/api/payments/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentMethodId, courseId }),
    });

    if (!response.ok) {
      throw new Error('Payment processing failed');
    }
  };

  return (
    <PaymentContext.Provider value={{ createPaymentIntent, processPayment }}>
      {children}
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