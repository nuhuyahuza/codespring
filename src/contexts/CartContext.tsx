import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart'; // Add constant for consistency

// Helper function to get cart from localStorage
const getStoredCart = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    console.log('Reading from localStorage:', savedCart); // Debug log
    
    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);
    if (!Array.isArray(parsedCart)) {
      console.warn('Stored cart is not an array, resetting');
      return [];
    }

    return parsedCart;
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

function CartProviderComponent({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = getStoredCart();
    console.log('Initial cart state:', stored); // Debug log
    return stored;
  });

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cartItems.length;

  // Sync with localStorage when cartItems changes
  useEffect(() => {
    console.log('Saving to localStorage:', cartItems); // Debug log
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      if (prevItems.some(cartItem => cartItem.id === item.id)) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  };

  const removeFromCart = (courseId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== courseId));
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
  };

  const isInCart = (courseId: string) => {
    return cartItems.some(item => item.id === courseId);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        total,
        addToCart, 
        removeFromCart, 
        clearCart, 
        isInCart 
      }}
    >
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
export { useCart }; 