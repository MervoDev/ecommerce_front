import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';
import { ProductCard } from './ProductCard';
import { apiService } from '../services/api';

interface ProductListProps {
  categoryId?: string;
  searchTerm?: string;
}

export function ProductList({ categoryId, searchTerm }: ProductListProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les produits au début
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer tous les produits du backend
        const data = await apiService.getProducts();
        setAllProducts(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError('Impossible de charger les produits. Vérifiez que le backend est démarré et accessible');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrer les produits côté frontend
  useEffect(() => {
    let filtered = [...allProducts];

    // Filtre par catégorie
    if (categoryId) {
      filtered = filtered.filter(product => {
        return product.categoryId === categoryId;
      });
    }

    // Filtre par recherche
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const descMatch = product.description.toLowerCase().includes(searchLower);
        return nameMatch || descMatch;
      });
    }

    setFilteredProducts(filtered);
  }, [allProducts, categoryId, searchTerm]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <span className="loading-spinner">⏳</span>
          Chargement des produits...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
        <div className="backend-help">
          <p><strong>Pour résoudre ce problème :</strong></p>
          <ol>
            <li>Vérifiez que votre backend NestJS est démarré</li>
            <li>Assurez-vous qu'il est accessible depuis le frontend</li>
            <li>Vérifiez que CORS est activé dans le backend</li>
          </ol>
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="no-products-container">
        <div className="no-products">
          <span className="no-products-icon">🔍</span>
          <h3>Aucun produit trouvé</h3>
          {categoryId || searchTerm ? (
            <div className="filter-info">
              {categoryId && <p>Catégorie : <strong>{categoryId}</strong></p>}
              {searchTerm && <p>Recherche : <strong>"{searchTerm}"</strong></p>}
              <p className="suggestion">Produit indisponible ou inexistant</p>
              <p className="suggestion">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <p>Aucun produit disponible pour le moment</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      {(categoryId || searchTerm) && (
        <div className="filter-summary">
          <span className="results-count">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </span>
          {categoryId && (
            <span className="active-filter">
              📂 Catégorie: {categoryId}
            </span>
          )}
          {searchTerm && (
            <span className="active-filter">
              🔍 Recherche: "{searchTerm}"
            </span>
          )}
          <span className="filter-status">
            {filteredProducts.length === 0 ? '❌ Aucun résultat' : '✅ Résultats trouvés'}
          </span>
        </div>
      )}
      
      <div className="product-list">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onViewDetails={(product) => {
              console.log('View details for:', product.name);
            }}
          />
        ))}
      </div>
    </div>
  );
}