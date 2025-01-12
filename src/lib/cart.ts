interface CartItem {
  id: string;
  title: string;
  price: number;
}

export const addToCart = (item: CartItem) => {
  try {
    console.log('Adding to cart:', item);
    const savedCart = localStorage.getItem('cart');
    console.log('Current localStorage cart:', savedCart);
    
    const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
    
    // Check if item already exists in cart
    if (!cart.some(cartItem => cartItem.id === item.id)) {
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Updated localStorage cart:', localStorage.getItem('cart'));
    } else {
      console.log('Item already in cart');
    }
    
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return [];
  }
};

export const getCart = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('cart');
    console.log('Retrieved cart from localStorage:', savedCart);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

export const clearCart = () => {
  try {
    localStorage.removeItem('cart');
    console.log('Cart cleared from localStorage');
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

export const removeFromCart = (courseId: string) => {
  try {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== courseId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log('Item removed, updated localStorage cart:', localStorage.getItem('cart'));
    return updatedCart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return [];
  }
}; 