import { useState, useEffect } from 'react';
import type { Cart } from '../types/Product';
import { apiService } from '../services/api';

// Hook pour gérer le panier côté serveur
// Pour l'instant on utilise le contexte local, mais on peut migrer vers ça plus tard
export function useServerCart(userId?: number) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserCart(userId);
    }
  }, [userId]);

  const fetchUserCart = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const userCart = await apiService.getUserCart(userId);
      setCart(userCart as Cart);
    } catch (err) {
      setError('Erreur lors du chargement du panier');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number, unitPrice: number) => {
    if (!cart || !userId) return;

    try {
      await apiService.addCartItem(cart.id, productId, quantity, unitPrice);
      await fetchUserCart(userId);
    } catch (err) {
      setError('Erreur lors de l\'ajout au panier');
      console.error('Error adding to cart:', err);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!userId) return;

    try {
      await apiService.updateCartItemQuantity(cartItemId, quantity);
      await fetchUserCart(userId);
    } catch (err) {
      setError('Erreur lors de la mise à jour');
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (!userId) return;

    try {
      await apiService.removeCartItem(cartItemId);
      await fetchUserCart(userId);
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Error removing item:', err);
    }
  };

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    refetch: () => userId && fetchUserCart(userId)
  };
}