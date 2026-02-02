import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { AdminLogin } from './pages/AdminLogin';
import { API_URL } from './config/api';
import './App.css'

const API_BASE_URL = API_URL || 'http://localhost:3000';

type PageType = 'home' | 'admin-login' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Vérifier l'URL au chargement
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.role === 'admin') {
        setIsAdminAuthenticated(true);
      }
    }

    const path = window.location.pathname;
    if (path === '/admin') {
      if (isAdminAuthenticated || (savedUser && JSON.parse(savedUser).role === 'admin')) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('admin-login');
      }
    }
  }, [isAdminAuthenticated]);

  // Écouter les changements d'URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        if (isAdminAuthenticated) {
          setCurrentPage('admin');
        } else {
          setCurrentPage('admin-login');
        }
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAdminAuthenticated]);

  const handleAdminLogin = async (credentials: { email: string; password: string }) => {
    try {
      console.log('Tentative de connexion avec:', credentials.email); // Debug
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Réponse du serveur:', data); // Debug

      if (response.ok) {
        console.log('Rôle utilisateur:', data.user.role); // Debug
        
        // Vérifier si l'utilisateur est admin
        if (data.user.role === 'admin') {
          setIsAdminAuthenticated(true);
          setCurrentPage('admin');
          setLoginError('');
          window.history.pushState({}, '', '/admin');
          
          // Stocker le token/user dans localStorage
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          console.log('Connexion admin réussie !'); // Debug
        } else {
          console.log('Utilisateur non admin, rôle:', data.user.role); // Debug
          setLoginError('Accès refusé : droits administrateur requis');
        }
      } else {
        console.log('Erreur de connexion:', data); // Debug
        setLoginError(data.message || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setLoginError('Erreur de connexion au serveur');
    }
  };

  const handleBackToShop = () => {
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
    localStorage.removeItem('adminUser');
    window.history.pushState({}, '', '/');
  };

  return (
    <CartProvider>
      <div className="app">
        {currentPage === 'home' && (
          <>
            <Navbar onSearch={setGlobalSearchTerm} />
            <main className="main-content">
              <HomePage globalSearchTerm={globalSearchTerm} />
            </main>
            <Footer />
          </>
        )}
        
        {currentPage === 'admin-login' && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBackToShop={handleBackToShop}
            error={loginError}
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
  );
}

export default App
