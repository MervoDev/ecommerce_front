import type { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

// Fonction pour convertir categoryId en nom lisible
const getCategoryName = (categoryId?: string | number): string => {
  if (!categoryId) return '';
  
  const categoryMap: { [key: string]: string } = {
    // Vêtements Homme
    'homme-chemises': 'Chemises Homme',
    'homme-pantalons': 'Pantalons Homme',
    'homme-costumes': 'Costumes',
    'homme-t-shirts': 'T-shirts & Polos',
    'homme-pulls': 'Pulls & Sweats',
    'homme-vestes': 'Vestes & Manteaux',
    'homme-sous-vetements': 'Sous-vêtements',
    
    // Vêtements Femme
    'femme-robes': 'Robes',
    'femme-jupes': 'Jupes',
    'femme-pantalons': 'Pantalons Femme',
    'femme-tops': 'Tops & Blouses',
    'femme-pulls': 'Pulls & Cardigans',
    'femme-vestes': 'Vestes & Manteaux',
    'femme-lingerie': 'Lingerie',
    
    // Chaussures
    'chaussures-homme': 'Chaussures Homme',
    'chaussures-femme': 'Chaussures Femme',
    'baskets': 'Baskets & Sneakers',
    'chaussures-sport': 'Chaussures de Sport',
    'sandales': 'Sandales & Tongs',
    'bottes': 'Bottes & Bottines',
    
    // Accessoires
    'sacs-main': 'Sacs à Main',
    'sacs-dos': 'Sacs à Dos',
    'portefeuilles': 'Portefeuilles',
    'ceintures': 'Ceintures',
    'montres': 'Montres',
    'bijoux': 'Bijoux',
    
    // Lunettes
    'lunettes-soleil': 'Lunettes de Soleil',
    'lunettes-vue': 'Lunettes de Vue',
    'lunettes-sport': 'Lunettes de Sport',
    
    // Maroquinerie
    'valises': 'Valises & Bagages',
    'sacs-voyage': 'Sacs de Voyage',
    'pochettes': 'Pochettes & Clutchs'
  };
  
  return categoryMap[categoryId.toString()] || categoryId.toString();
};

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { dispatch } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        {product.imageUrl && !imageError ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="product-image"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="no-image-placeholder">
            <span className="no-image-icon">🖼️</span>
            <span className="no-image-text">Pas d'image</span>
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="stock-overlay">
            <span>Rupture de stock</span>
          </div>
        )}
        
        <div className="product-badge">
          <span className="price-badge">
            {product.price && !isNaN(Number(product.price)) 
              ? Number(product.price).toFixed(2) 
              : '0.00'
            } €
          </span>
        </div>
      </div>
      
      <div className="product-content">
        <div className="product-header">
          <h3 className="product-title">{product.name}</h3>
          {product.categoryId && (
            <span className="product-category">{getCategoryName(product.categoryId)}</span>
          )}
        </div>
        
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="stock-info">
            <span className={`stock-indicator ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} disponible${product.stock > 1 ? 's' : ''}` : 'Rupture de stock'}
            </span>
          </div>
          
          <div className="product-actions">
            {onViewDetails && (
              <button 
                onClick={() => onViewDetails(product)}
                className="btn-details"
                title="Voir les détails"
              >
                👁️
              </button>
            )}
            
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-add-cart"
              title="Ajouter au panier"
            >
              {product.stock === 0 ? '❌' : '🛒'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}