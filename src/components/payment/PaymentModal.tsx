import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Label,
} from '@/components/ui';

const mobileMoneySchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  operator: z.enum(['MTN', 'ORANGE', 'MOOV']),
});

const cardSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Must be in MM/YY format'),
  cvv: z.string().length(3, 'CVV must be 3 digits'),
  cardHolderName: z.string().min(3, 'Cardholder name is required'),
});

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  amount: number;
  onPaymentComplete: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  courseTitle,
  amount,
  onPaymentComplete,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('mobile');
  const [isProcessing, setIsProcessing] = useState(false);

  const mobileMoneyForm = useForm<z.infer<typeof mobileMoneySchema>>({
    resolver: zodResolver(mobileMoneySchema),
  });

  const cardForm = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
  });

  const handlePayment = async (values: any) => {
    try {
      setIsProcessing(true);
      // TODO: Integrate with payment gateway
      console.log('Payment values:', { method: paymentMethod, values });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onPaymentComplete();
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay ${amount} to enroll in {courseTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            defaultValue="mobile"
            onValueChange={(value) => setPaymentMethod(value as 'card' | 'mobile')}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="mobile"
                id="mobile"
                className="peer sr-only"
              />
              <Label
                htmlFor="mobile"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 h-6 w-6"
                >
                  <path d="M15.5 1h-8A2.5 2.5 0 0 0 5 3.5v17A2.5 2.5 0 0 0 7.5 23h8a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 15.5 1Z" />
                  <path d="M12 18h.01" />
                </svg>
                Mobile Money
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="card"
                id="card"
                className="peer sr-only"
              />
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 h-6 w-6"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                Card Payment
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-4">
          {paymentMethod === 'mobile' ? (
            <Form {...mobileMoneyForm}>
              <form onSubmit={mobileMoneyForm.handleSubmit(handlePayment)} className="space-y-4">
                <FormField
                  control={mobileMoneyForm.control}
                  name="operator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Operator</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                          <SelectItem value="ORANGE">Orange Money</SelectItem>
                          <SelectItem value="MOOV">Moov Money</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={mobileMoneyForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...cardForm}>
              <form onSubmit={cardForm.handleSubmit(handlePayment)} className="space-y-4">
                <FormField
                  control={cardForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 5678 9012 3456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={cardForm.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={cardForm.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={cardForm.control}
                  name="cardHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 