import { useState } from 'react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onSearch?: (searchTerm: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
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

          {/* Cart */}
          <div className="nav-cart">
            <button className="cart-btn">
              🛒
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>
          </div>

          {/* User */}
          <div className="nav-user">
            <button className="user-btn">👤</button>
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
  );
}