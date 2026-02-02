import { useState } from 'react';
import { ProductManagement } from './ProductManagement';

interface AdminLayoutProps {
  onBackToShop: () => void;
}

export function AdminLayout({ onBackToShop }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <nav className="admin-nav">
          <button 
            className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span>📦</span> Gestion des Produits
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <span>📂</span> Catégories
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span>📋</span> Commandes
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span>👥</span> Utilisateurs
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span>📊</span> Statistiques
          </button>
        </nav>
        
        <div className="sidebar-bottom">
          <button 
            onClick={onBackToShop}
            className="back-to-shop-sidebar-btn"
          >
            ← Retour à la boutique
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'categories' && (
          <div className="coming-soon">
            <h2>🚧 Gestion des Catégories</h2>
            <p>Cette fonctionnalité sera bientôt disponible !</p>
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="coming-soon">
            <h2>🚧 Gestion des Commandes</h2>
            <p>Cette fonctionnalité sera bientôt disponible !</p>
          </div>
        )}
        {activeTab === 'users' && (
          <div className="coming-soon">
            <h2>🚧 Gestion des Utilisateurs</h2>
            <p>Cette fonctionnalité sera bientôt disponible !</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="coming-soon">
            <h2>🚧 Statistiques</h2>
            <p>Cette fonctionnalité sera bientôt disponible !</p>
          </div>
        )}
      </div>
    </div>
  );
}