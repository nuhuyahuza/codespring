import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { usePayment } from '../context/PaymentContext';
import { formatCurrency } from '@/lib/utils';

interface PaymentFormProps {
  courseId: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ courseId, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, processPayment } = usePayment();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setIsLoading(true);

      // Create payment intent
      const { clientSecret } = await createPaymentIntent(amount, courseId);

      // Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentMethod) {
        throw new Error('Payment method creation failed');
      }

      // Process payment on the server
      await processPayment(paymentMethod.id, courseId);

      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Payment Details</h3>
          <div className="p-4 border rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Amount</h3>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(amount)}
          </p>
        </div>
      </div>
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
      >
        {isLoading ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
      </Button>
    </form>
  );
} 