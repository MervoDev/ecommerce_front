import { useState, useEffect } from 'react';
import type { Product, Category } from '../types/Product';
import { apiService } from '../services/api';
import { ProductForm } from './ProductForm';
import { ProductList as AdminProductList } from './ProductList';

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await apiService.deleteProduct(productId);
        await fetchData(); // Recharger la liste
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du produit');
      }
    }
  };

  const handleFormSubmit = async (productData: Partial<Product>) => {
    try {
      console.log('Début sauvegarde produit...');
      
      if (editingProduct) {
        await apiService.updateProduct(editingProduct.id, productData);
        console.log('Produit mis à jour');
      } else {
        await apiService.createProduct(productData);
        console.log('Produit créé');
      }
      
      setShowForm(false);
      setEditingProduct(null);
      
      // Attendre un peu avant de recharger pour éviter les doublons
      setTimeout(async () => {
        await fetchData();
      }, 100);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du produit');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  return (
    <div className="product-management">
      <div className="admin-header">
        <h1>🛍️ Gestion des Produits</h1>
        <button 
          className="btn-primary"
          onClick={handleCreateProduct}
        >
          ➕ Nouveau Produit
        </button>
      </div>

      {showForm ? (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <AdminProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
}