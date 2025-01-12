import { ShoppingCart as CartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { useState, useEffect } from 'react';

export function ShoppingCart() {
  const { cartItems, cartCount, removeFromCart } = useCart();
  const [selectedItem, setSelectedItem] = useState<{id: string; title: string; price: number} | null>(null);
  const [total, setTotal] = useState(0);
  
  // Update total whenever cartItems changes
  useEffect(() => {
	  const newTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
	  console.log("Hi",cartItems);
    setTotal(newTotal);
    console.log('Cart updated:', { items: cartItems, count: cartCount, total: newTotal });
  }, [cartItems, cartCount]);

  const handlePurchase = (item: {id: string; title: string; price: number}) => {
    console.log('Purchasing item:', item);
    setSelectedItem(item);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <CartIcon className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {cartCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex-1 overflow-y-auto">
          {cartCount === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                >
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(item)}
                    >
                      Purchase
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>

      {selectedItem && (
        <PaymentModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          courseId={selectedItem.id}
          courseTitle={selectedItem.title}
          amount={selectedItem.price}
          onPaymentComplete={() => {
            removeFromCart(selectedItem.id);
            setSelectedItem(null);
          }}
        />
      )}
    </Sheet>
  );
} 
