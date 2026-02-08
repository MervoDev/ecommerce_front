import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types/Product';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  refreshCart: () => Promise<void>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART': {
      return {
        items: action.payload,
        total: calculateTotal(action.payload)
      };
    }
    
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }
      
      const newItems = [...state.items, { product: action.payload, quantity: 1 }];
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload.id);
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.product.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    
    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const { user, isAuthenticated } = useAuth();

  // Fonction pour charger le panier depuis l'API
  const loadCart = async () => {
    if (!isAuthenticated || !user?.id) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }

    try {
      console.log('Loading cart for user:', user.id);
      
      const cart = await apiService.getUserCart(user.id);
      
      if (!cart) {
        console.log('No cart found for user');
        dispatch({ type: 'CLEAR_CART' });
        return;
      }

      console.log('Cart loaded:', cart);

      const cartItems = await apiService.getCartItems(cart.id);
      console.log('Cart items loaded:', cartItems);

      if (!cartItems || cartItems.length === 0) {
        dispatch({ type: 'CLEAR_CART' });
        return;
      }

      const items: CartItem[] = cartItems.map((item: any) => ({
        product: {
          ...item.product,
          price: parseFloat(item.product.price) // Convertir le prix en nombre
        },
        quantity: item.quantity
      }));

      dispatch({ type: 'SET_CART', payload: items });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  // Charger le panier quand l'utilisateur se connecte
  useEffect(() => {
    loadCart();
  }, [user?.id, isAuthenticated]);

  return (
    <CartContext.Provider value={{ state, dispatch, refreshCart: loadCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}