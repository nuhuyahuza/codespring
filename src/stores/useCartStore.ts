import { create } from 'zustand';

interface CartStore {
  items: string[];
  addItem: (courseId: string) => void;
  removeItem: (courseId: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (courseId) => 
    set((state) => ({ 
      items: state.items.includes(courseId) 
        ? state.items 
        : [...state.items, courseId] 
    })),
  removeItem: (courseId) =>
    set((state) => ({ 
      items: state.items.filter(id => id !== courseId) 
    })),
})); 