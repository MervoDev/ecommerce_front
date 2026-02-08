import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartPage } from './pages/CartPage';
import { API_URL } from './config/api';
import type { Product } from './types/Product';
import './App.css'

const API_BASE_URL = API_URL || 'http://localhost:3000';

type PageType = 'home' | 'login' | 'register' | 'admin' | 'cart';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Vérifier l'URL au chargement
  useEffect(() => {
    // Vérifier si un utilisateur est connecté
    const savedAdmin = localStorage.getItem('adminUser');
    
    if (savedAdmin) {
      const admin = JSON.parse(savedAdmin);
      if (admin.role === 'admin') {
        setIsAdminAuthenticated(true);
      }
    }
    
    // Gérer la route initiale
    const path = window.location.pathname;
    console.log('Route actuelle:', path);
    
    if (path === '/admin') {
      if (savedAdmin && JSON.parse(savedAdmin).role === 'admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('login');
      }
    } else if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/register') {
      setCurrentPage('register');
    } else if (path === '/cart') {
      setCurrentPage('cart');
    } else {
      setCurrentPage('home');
    }
  }, []);

  // Écouter les changements d'URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        if (isAdminAuthenticated) {
          setCurrentPage('admin');
        } else {
          setCurrentPage('login');
        }
      } else if (path === '/login') {
        setCurrentPage('login');
      } else if (path === '/register') {
        setCurrentPage('register');
      } else if (path === '/cart') {
        setCurrentPage('cart');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAdminAuthenticated]);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      setLoginError('');
      console.log('Tentative de connexion avec:', credentials.email);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Réponse du serveur:', data);

      if (response.ok) {
        console.log('Rôle utilisateur:', data.user.role);
        
        // Stocker le token et l'utilisateur avec les mêmes clés que authService
        if (data.access_token || data.token) {
          const token = data.access_token || data.token;
          localStorage.setItem('auth_token', token);
        }
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        
        // Vérifier le rôle et rediriger en conséquence
        if (data.user.role === 'admin') {
          setIsAdminAuthenticated(true);
          setCurrentPage('admin');
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          window.history.pushState({}, '', '/admin');
          console.log('Connexion admin réussie !');
        } else {
          // Utilisateur normal → rediriger vers le panier
          setCurrentPage('cart');
          // Déclencher un événement pour mettre à jour le contexte
          window.dispatchEvent(new Event('storage'));
          window.history.pushState({}, '', '/cart');
          console.log('Connexion utilisateur réussie ! Redirection vers le panier');
        }
      } else {
        console.log('Erreur de connexion:', data);
        setLoginError(data.message || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setLoginError('Erreur de connexion au serveur');
    }
  };

  const handleRegister = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setRegisterError('');
      console.log('Tentative d\'inscription:', userData.email);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Réponse du serveur:', data);

      if (response.ok) {
        // Inscription réussie, connecter automatiquement l'utilisateur et rediriger vers le panier
        
        // Stocker le token et l'utilisateur avec les mêmes clés que authService
        if (data.access_token || data.token) {
          const token = data.access_token || data.token;
          localStorage.setItem('auth_token', token);
        }
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        
        setCurrentPage('cart');
        // Déclencher un événement pour mettre à jour le contexte
        window.dispatchEvent(new Event('storage'));
        window.history.pushState({}, '', '/cart');
        console.log('Inscription réussie ! Redirection vers le panier');
      } else {
        console.log('Erreur d\'inscription:', data);
        setRegisterError(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setRegisterError('Erreur de connexion au serveur');
    }
  };

  const handleGoToCart = () => {
    setCurrentPage('cart');
    window.history.pushState({}, '', '/cart');
  };

  const handleCartAuthRequired = () => {
    // Si l'utilisateur essaie d'accéder au panier sans être connecté
    // On peut soit ouvrir le modal d'auth, soit le rediriger vers la page d'accueil
    setCurrentPage('home');
    // Optionnel : ouvrir le modal d'auth
    // setShowAuthModal(true);
  };

  const handleAuthRequired = (product: Product) => {
    console.log('Auth required for product:', product.name);
    // Rediriger vers la page de connexion au lieu d'ouvrir un modal
    setCurrentPage('login');
    window.history.pushState({}, '', '/login');
  };

  const handleBackToShop = () => {
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('currentUser');
    window.history.pushState({}, '', '/');
  };

  const handleGoToLogin = () => {
    setCurrentPage('login');
    window.history.pushState({}, '', '/login');
  };

  const handleGoToRegister = () => {
    setCurrentPage('register');
    window.history.pushState({}, '', '/register');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          {currentPage === 'home' && (
            <>
              <Navbar 
                onSearch={setGlobalSearchTerm} 
                onGoToCart={handleGoToCart}
                onGoToLogin={handleGoToLogin}
              />
              <main className="main-content">
                <HomePage 
                  globalSearchTerm={globalSearchTerm} 
                  onCartAdded={handleGoToCart}
                  onAuthRequired={handleAuthRequired}
                />
              </main>
              <Footer />
            </>
          )}
          
          {currentPage === 'cart' && (
            <>
              <Navbar 
                onSearch={setGlobalSearchTerm} 
                onGoToCart={handleGoToCart}
                onGoToLogin={handleGoToLogin}
              />
              <main className="main-content">
                <CartPage 
                  onBackToShop={handleBackToShop}
                  onAuthRequired={handleCartAuthRequired}
                />
              </main>
              <Footer />
            </>
          )}
          
          {currentPage === 'login' && (
            <LoginPage
              onLogin={handleLogin}
              onBackToShop={handleBackToShop}
              onGoToRegister={handleGoToRegister}
              error={loginError}
            />
          )}
          
          {currentPage === 'register' && (
            <RegisterPage
              onRegister={handleRegister}
              onBackToLogin={handleGoToLogin}
              error={registerError}
            />
          )}
          
          {currentPage === 'admin' && (
            <div className="admin-container">
              <div className="admin-navbar">
                <div className="admin-nav-logo">
                  <img src="/logo.png.png" alt="Logo" className="admin-nav-logo-image" />
                </div>
                <div className="admin-nav-right">
                  <span className="admin-welcome">Administration</span>
                  <button 
                    onClick={handleAdminLogout}
                    className="logout-btn"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
              <AdminPage onBackToShop={handleBackToShop} />
            </div>
          )}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App
