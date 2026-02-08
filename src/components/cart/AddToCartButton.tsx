import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { apiService } from '../../services/api';
import type { Product } from '../../types/Product';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  onCartAdded?: () => void;
  onAuthRequired?: (product: Product) => void; // Callback pour ouvrir le modal global
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  className = '',
  onCartAdded,
  onAuthRequired,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    console.log('AddToCart clicked for product:', product.name);
    
    // Récupérer l'utilisateur directement depuis le localStorage comme solution de secours
    const userFromStorage = localStorage.getItem('auth_user');
    console.log('User from localStorage:', userFromStorage);
    
    let currentUser = user;
    
    // Si le contexte n'a pas l'utilisateur, essayer de le récupérer du localStorage
    if (!currentUser || !currentUser.id) {
      if (userFromStorage) {
        try {
          currentUser = JSON.parse(userFromStorage);
          console.log('User parsed from localStorage:', currentUser);
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
    }
    
    console.log('Final user object:', currentUser);
    console.log('isAuthenticated:', isAuthenticated);
    
    // Vérifier l'authentification
    if (!isAuthenticated || !currentUser || !currentUser.id) {
      console.log('User not authenticated, user is null, or user.id is missing');
      if (onAuthRequired) {
        onAuthRequired(product);
      }
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('User ID to use:', currentUser.id);
      
      // Créer ou récupérer le panier de l'utilisateur
      let cart: any = await apiService.getUserCart(currentUser.id);
      console.log('Cart retrieved:', cart);
      
      // Si le panier n'existe pas (null ou undefined), créer un nouveau
      if (!cart) {
        console.log('No cart found, creating new cart for user:', currentUser.id);
        cart = await apiService.createCart(currentUser.id);
        console.log('New cart created:', cart);
      }
      
      // Vérification finale que le panier existe
      if (!cart || !cart.id) {
        throw new Error('Impossible de créer ou récupérer le panier');
      }

      console.log('Adding item to cart:', {
        cartId: cart.id,
        productId: product.id,
        quantity,
        price: product.price
      });

      // Ajouter le produit au panier
      await apiService.addCartItem(
        cart.id,
        product.id,
        quantity,
        product.price
      );

      // Recharger le panier depuis l'API pour mettre à jour l'affichage
      await refreshCart();

      setMessage('✅ Produit ajouté au panier !');
      
      // Si connecté et produit ajouté avec succès, rediriger vers le panier
      if (isAuthenticated && onCartAdded) {
        setTimeout(() => {
          onCartAdded();
        }, 1000);
      } else {
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setMessage('Erreur lors de l\'ajout au panier');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={loading || product.stock === 0}
        className={`add-to-cart-btn ${className} ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Ajout...' : 'Ajouter au panier'}
      </button>

      {message && (
        <div className={`cart-message ${message.includes('Erreur') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </>
  );
};