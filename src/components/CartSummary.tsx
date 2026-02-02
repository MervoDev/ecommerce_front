import { useCart } from '../context/CartContext';

export function CartSummary() {
  const { state, dispatch } = useCart();

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="cart-summary-bottom empty">
        <div className="empty-cart">
          <span className="empty-icon">🛒</span>
          <h3>Panier vide</h3>
          <p>Ajoutez des produits à votre panier pour commencer vos achats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-summary-bottom">
      <div className="cart-items-grid">
        {state.items.map(item => (
          <div key={item.product.id} className="cart-item-card">
            <div className="cart-item-image">
              {item.product.imageUrl ? (
                <img src={item.product.imageUrl} alt={item.product.name} />
              ) : (
                <div className="no-image">📦</div>
              )}
            </div>
            
            <div className="cart-item-info">
              <h4 className="cart-item-name">{item.product.name}</h4>
              <p className="cart-item-price">{item.product.price.toFixed(2)} € / unité</p>
            </div>
            
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="qty-btn"
                >
                  −
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
              
              <div className="item-total">
                {(item.product.price * item.quantity).toFixed(2)} €
              </div>
              
              <button 
                onClick={() => removeItem(item.product.id)}
                className="remove-btn"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-footer">
        <div className="cart-summary-info">
          <span className="total-items">{state.items.length} article{state.items.length > 1 ? 's' : ''}</span>
          <span className="total-price">Total: {state.total.toFixed(2)} €</span>
        </div>
        
        <div className="cart-actions">
          <button 
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
            className="btn-clear-cart"
          >
            Vider le panier
          </button>
          <button className="btn-checkout">
            Passer commande 🚀
          </button>
        </div>
      </div>
    </div>
  );
}