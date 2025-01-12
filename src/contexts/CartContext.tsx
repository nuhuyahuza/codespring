import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to get cart from localStorage
const getStoredCart = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('cart');
    console.log('Raw cart from localStorage:', savedCart);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      console.log('Parsed cart:', parsedCart);
      return parsedCart;
    }
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
  }
  return [];
};

function CartProviderComponent({ children }: { children: ReactNode }) {
  // Initialize state with localStorage data
  const [cartItems, setCartItems] = useState<CartItem[]>(getStoredCart());
  const [cartCount, setCartCount] = useState<number>(getStoredCart().length);

  // Update cart count whenever cartItems changes
  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems]);

  // Sync with localStorage when cartItems changes
  useEffect(() => {
    console.log('Cart items changed:', cartItems);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        const newCart = e.newValue ? JSON.parse(e.newValue) : [];
        setCartItems(newCart);
        setCartCount(newCart.length);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (item: CartItem) => {
    console.log('Adding item to cart:', item);
    setCartItems(prevItems => {
      if (prevItems.some(cartItem => cartItem.id === item.id)) {
        console.log('Item already in cart');
        return prevItems;
      }
      const newCart = [...prevItems, item];
      console.log('New cart state:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (courseId: string) => {
    console.log('Removing item from cart:', courseId);
    setCartItems(prevItems => {
      const newCart = prevItems.filter(item => item.id !== courseId);
      console.log('New cart state after removal:', newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    console.log('Clearing cart');
    localStorage.removeItem('cart');
    setCartItems([]);
  };

  const isInCart = (courseId: string) => {
    return cartItems.some(item => item.id === courseId);
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export const CartProvider = CartProviderComponent;
export  {useCart}; 