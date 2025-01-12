import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart as CartIcon, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
} from '@/components/ui';
import { useAuth } from '@/features/auth';
import type { CartItem } from '@/features/auth/types';
import { formatPrice } from '@/lib/utils';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { toast } from 'sonner';

export function ShoppingCart() {
  const { cart, removeFromCart, clearCart } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum: number, item: CartItem) => sum + item.price, 0);

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    clearCart();
    toast.success('Successfully enrolled in courses!');
    navigate('/dashboard/student');
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <CartIcon className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-8 space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        courseTitle={cart.length === 1 ? cart[0].title : `${cart.length} Courses`}
        amount={totalAmount}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
} 