import type { Product } from '../types/Product';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className="admin-product-list">
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="product-image-cell">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="admin-product-image"
                      />
                    ) : (
                      <div className="no-image-placeholder">📷</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="product-name-cell">
                    <strong>{product.name}</strong>
                    <p className="product-description-preview">
                      {product.description.length > 50 
                        ? `${product.description.substring(0, 50)}...`
                        : product.description
                      }
                    </p>
                  </div>
                </td>
                <td>
                  {product.category?.name || 'Sans catégorie'}
                </td>
                <td>
                  <span className="price-cell">
                    {product.price && !isNaN(Number(product.price)) 
                      ? Number(product.price).toFixed(0) 
                      : '0'
                    } FCFA
                  </span>
                </td>
                <td>
                  <span className={`stock-cell ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(product)}
                      className="btn-edit"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="btn-delete"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}