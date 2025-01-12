import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  onAddToCart?: () => void;
}

export function AddToCartButton({
  courseId,
  courseTitle,
  price,
  onAddToCart,
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = () => {
    try {
      console.log('Adding course to cart:', { courseId, courseTitle, price });
      
      addToCart({
        id: courseId,
        title: courseTitle,
        price,
      });
      
      // Verify item was added to localStorage
      const savedCart = localStorage.getItem('cart');
      console.log('Verifying cart in localStorage:', savedCart);
      
      toast.success('Added to cart!');
      onAddToCart?.();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Button 
      onClick={handleAddToCart}
      variant="secondary"
      disabled={isInCart(courseId)}
    >
      {isInCart(courseId) ? 'In Cart' : 'Add to Cart'}
    </Button>
  );
} 