import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CartSummary } from '../components/CartSummary';

interface CartPageProps {
  onBackToShop: () => void;
  onAuthRequired?: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onBackToShop, onAuthRequired }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="cart-page-container">
        <div className="cart-page-header">
          <button onClick={onBackToShop} className="back-to-shop-btn">
            ← Retour à la boutique
          </button>
          <h1>🛒 Mon Panier</h1>
        </div>
        
        <div className="cart-auth-required">
          <div className="auth-message">
            <h2>🔒 Connexion requise</h2>
            <p>Vous devez être connecté pour accéder à votre panier.</p>
            <div className="auth-actions">
              <button 
                onClick={() => {
                  if (onAuthRequired) {
                    onAuthRequired();
                  }
                }} 
                className="btn-primary auth-btn-large"
              >
                Se connecter / S'inscrire
              </button>
              <button onClick={onBackToShop} className="btn-secondary">
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-page-header">
        <button onClick={onBackToShop} className="back-to-shop-btn">
          ← Continuer mes achats
        </button>
        <div className="cart-header-info">
          <h1>🛒 Mon Panier</h1>
          <div className="user-info">
            <span>Connecté en tant que: <strong>{user?.firstName || user?.email}</strong></span>
          </div>
        </div>
      </div>
      
      <div className="cart-page-content">
        <CartSummary />
        
        <div className="cart-actions-bottom">
          <button onClick={onBackToShop} className="btn-continue-shopping">
            ← Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
};