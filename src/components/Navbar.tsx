import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onSearch?: (searchTerm: string) => void;
  onGoToCart?: () => void;
  onGoToLogin?: () => void;
}

export function Navbar({ onSearch, onGoToCart, onGoToLogin }: NavbarProps) {
  const { state } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Recherche en temps réel - déclencher immédiatement
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    // Rediriger vers la page d'accueil après déconnexion
    window.location.href = '/';
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <img src="/logo.png.png" alt="Notre Boutique" className="logo-image" />
          </div>

          {/* Navigation Links */}
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <a href="#" className="nav-link">Accueil</a>
            <a href="#" className="nav-link">Produits</a>
            <a href="#" className="nav-link">Catégories</a>
            <a href="#" className="nav-link">À propos</a>
            <a href="#" className="nav-link">Contact</a>
          </div>

          {/* Right side - Search, Cart, User */}
          <div className="nav-right">
            {/* Search */}
            <form className="nav-search" onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder="Rechercher un produit..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input-nav"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={handleSearchClear}
                  className="search-clear-btn"
                  title="Effacer la recherche"
                >
                  ✖️
                </button>
              )}
              <button type="submit" className="search-btn">🔍</button>
            </form>

            {/* Cart - Toujours cliquable */}
            <div className="nav-cart">
              <button 
                className="cart-btn"
                onClick={() => {
                  if (onGoToCart) {
                    onGoToCart();
                  }
                }}
                title={isAuthenticated ? "Voir mon panier" : "Connectez-vous pour voir votre panier"}
              >
                🛒
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </button>
            </div>

            {/* User Authentication */}
            <div className="nav-user">
              {isAuthenticated ? (
                <div className="user-menu-container">
                  <button 
                    className="user-btn authenticated"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    👤 {user?.firstName || user?.email}
                  </button>
                  
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <p><strong>{user?.firstName} {user?.lastName}</strong></p>
                        <p className="user-email">{user?.email}</p>
                      </div>
                      <hr />
                      <button className="dropdown-item">Mon profil</button>
                      <button className="dropdown-item">Mes commandes</button>
                      <button 
                        className="dropdown-item cart-link"
                        onClick={() => {
                          if (onGoToCart) {
                            onGoToCart();
                          }
                          setShowUserMenu(false);
                        }}
                      >
                        🛒 Mon panier ({totalItems})
                      </button>
                      <hr />
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  className="login-btn-nav"
                  onClick={() => {
                    if (onGoToLogin) {
                      onGoToLogin();
                    }
                  }}
                >
                  Connexion
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}