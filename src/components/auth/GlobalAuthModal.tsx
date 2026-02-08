import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Product } from '../../types/Product';
import type { RegisterData, LoginCredentials } from '../../types/Auth';

interface GlobalAuthModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const GlobalAuthModal: React.FC<GlobalAuthModalProps> = ({
  isOpen,
  product,
  onClose,
  onSuccess,
}) => {
  const { login: contextLogin, register: contextRegister } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Formulaires
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  // Fermer avec Escape et empêcher le scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLogin(false);
      setAuthError('');
      setLoginData({ email: '', password: '' });
      setRegisterData({ email: '', password: '', firstName: '', lastName: '' });
    }
  }, [isOpen]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setAuthLoading(true);
    setAuthError('');

    try {
      if (isLogin) {
        await contextLogin(loginData); // Utiliser le contexte
      } else {
        await contextRegister(registerData); // Utiliser le contexte
      }
      
      // Fermer le modal et déclencher le succès
      onClose();
      onSuccess();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Erreur d\'authentification');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Connexion' : 'Inscription pour ajouter au panier'}</h2>
          <button className="auth-modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="product-info-modal">
          <p>Produit sélectionné : <strong>{product.name}</strong></p>
          <p>Prix : <strong>{Number(product.price).toFixed(0)} FCFA</strong></p>
        </div>

        <form onSubmit={handleAuth} className="auth-modal-form">
          {!isLogin && (
            <>
              <div className="auth-form-group">
                <label htmlFor="firstName">Prénom *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={registerData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="auth-form-group">
                <label htmlFor="lastName">Nom *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={registerData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}
          
          <div className="auth-form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={isLogin ? loginData.email : registerData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="password">Mot de passe *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={isLogin ? loginData.password : registerData.password}
              onChange={handleInputChange}
              required
              minLength={6}
            />
          </div>

          {authError && (
            <div className="auth-modal-error">{authError}</div>
          )}

          <button 
            type="submit" 
            disabled={authLoading}
            className="auth-modal-submit"
          >
            {authLoading 
              ? (isLogin ? 'Connexion...' : 'Inscription...') 
              : (isLogin ? 'Se connecter et ajouter au panier' : 'S\'inscrire et ajouter au panier')
            }
          </button>
        </form>

        <div className="auth-modal-footer">
          {isLogin ? (
            <p>
              Pas encore de compte ?{' '}
              <button 
                type="button" 
                onClick={() => {
                  setIsLogin(false);
                  setAuthError('');
                }}
                className="auth-switch-btn"
              >
                S'inscrire
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <button 
                type="button" 
                onClick={() => {
                  setIsLogin(true);
                  setAuthError('');
                }}
                className="auth-switch-btn"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};