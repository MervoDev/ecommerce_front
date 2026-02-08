import { useState, useEffect } from 'react';
import { ProductList } from '../components/ProductList';
import { CategoryFilter } from '../components/CategoryFilter';
import { CartSummary } from '../components/CartSummary';

interface HomePageProps {
  globalSearchTerm?: string;
  onCartAdded?: () => void;
  onAuthRequired?: (product: any) => void;
}

export function HomePage({ globalSearchTerm, onCartAdded, onAuthRequired }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  // Synchroniser avec la recherche globale de la navbar
  useEffect(() => {
    if (globalSearchTerm !== undefined) {
      setSearchTerm(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  // Utiliser la recherche globale ou locale
  const effectiveSearchTerm = globalSearchTerm || searchTerm;

  return (
    <div className="home-page">
      <header className="page-header">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Notre Boutique</h1>
            <p className="hero-subtitle">Découvrez nos produits de qualité</p>
          </div>
        </div>
        
        <div className="search-filters">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          {(selectedCategory || effectiveSearchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory(undefined);
                setSearchTerm('');
                // Effacer aussi la recherche globale si elle existe
                if (globalSearchTerm) {
                  // On ne peut pas directement modifier globalSearchTerm, 
                  // mais on peut indiquer à l'utilisateur de l'effacer dans la navbar
                }
              }}
              className="clear-filters-btn"
              title="Effacer tous les filtres"
            >
              ✖️ Effacer les filtres
            </button>
          )}
        </div>
      </header>
      
      {/* Section produits en pleine largeur */}
      <main className="products-main-section">
        <ProductList 
          searchTerm={effectiveSearchTerm || undefined}
          categoryId={selectedCategory}
          onCartAdded={onCartAdded}
          onAuthRequired={onAuthRequired}
        />
      </main>
      
      {/* Panier déplacé en bas */}
      <aside className="cart-section-bottom">
        <div className="cart-container">
          <h2 className="cart-title">🛒 Mon Panier</h2>
          <CartSummary />
        </div>
      </aside>
    </div>
  );
}