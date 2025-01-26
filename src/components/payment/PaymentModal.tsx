import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth';
import { api } from '@/lib/api';

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
  const { token, updateUser } = useAuth();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      if (isDev) {
        console.log('Submitting enrollment for course:', courseId);
        
        const response = await api.post(`/courses/${courseId}/enroll`, {});

        if (!response.success) {
          throw new Error('Enrollment failed');
        }

        await updateUser();
        toast.success('Successfully enrolled in course!');
        onPaymentComplete();
      } else {
        // Handle production payment flow here
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course. Please try again.');
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await api.post(`/courses/${courseId}/enroll`, {});
      await updateUser();
      onPaymentComplete();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course. Please try again.');
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