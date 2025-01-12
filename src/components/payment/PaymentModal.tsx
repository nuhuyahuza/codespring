import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  amount: number;
  onPaymentComplete: () => void;
  courseId: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  courseTitle,
  amount,
  onPaymentComplete,
  courseId,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const isDev = import.meta.env.DEV;

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsProcessing(true);
      
      // In development mode, create enrollment directly
      if (isDev) {
        console.log('Submitting enrollment for course:', courseId);
        
        // Create enrollment
        const response = await fetch('http://localhost:5000/api/courses/' + courseId + '/enroll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			
          },
          credentials: 'include',
        });

        console.log('Response status:', response.status);
        const data = await response.text();
        console.log('Response data:', data);

        try {
          const jsonData = JSON.parse(data);
          if (!response.ok) {
            throw new Error(jsonData.error || 'Failed to create enrollment');
          }
          
          onPaymentComplete();
          toast.success('Successfully enrolled in course!');
        } catch (e) {
          throw new Error('Invalid response from server: ' + data);
        }
        return;
      }

      // Regular payment processing for production
      // TODO: Integrate with payment gateway
      
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error instanceof Error ? error.message : 'Enrollment failed. Please try again.');
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">{courseTitle}</h3>
            <p className="text-sm text-muted-foreground">
              Total Amount: ${amount.toFixed(2)}
            </p>
          </div>
          
          {isDev && (
            <div className="rounded-md bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                Development Mode: Payment verification is disabled. Click Pay Now to enroll directly.
              </p>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 