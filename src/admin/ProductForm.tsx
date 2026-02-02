import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (productData: Partial<Product>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: '',
    isActive: true
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId?.toString() || '',
        isActive: product.isActive
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Partial<Product> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      imageUrl: formData.imageUrl || undefined,
      categoryId: formData.categoryId || undefined,
      isActive: formData.isActive
    };
    
    onSubmit(productData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Configuration des limites de fichier
  const FILE_CONFIG = {
    maxSize: 10 * 1024 * 1024, 
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSizeMB: 10
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileChange appelé');
    const file = e.target.files?.[0];
    console.log('Fichier sélectionné:', file);
    
    if (file) {
      console.log('Détails du fichier:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Vérifier la taille du fichier
      if (file.size > FILE_CONFIG.maxSize) {
        alert(`Le fichier est trop volumineux. Taille maximum : ${FILE_CONFIG.maxSizeMB}MB`);
        return;
      }

      // Vérifier le type de fichier (plus strict)
      if (!FILE_CONFIG.allowedTypes.includes(file.type)) {
        alert('Format non supporté. Utilisez : JPG, PNG ou WebP');
        return;
      }

      // Afficher les infos du fichier (optionnel)
      console.log(`Fichier sélectionné: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

      // Convertir en base64 pour l'aperçu et le stockage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        console.log('Image convertie en base64, taille:', base64String.length);
        setFormData(prev => ({ 
          ...prev, 
          imageUrl: base64String 
        }));
        console.log('FormData mis à jour avec image');
      };
      reader.readAsDataURL(file);
    } else {
      console.log('Aucun fichier sélectionné');
    }
  };

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h2>{product ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nom du produit *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Catégorie *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <optgroup label="👔 Vêtements Homme">
                <option value="homme-chemises">Chemises</option>
                <option value="homme-pantalons">Pantalons</option>
                <option value="homme-costumes">Costumes</option>
                <option value="homme-t-shirts">T-shirts & Polos</option>
                <option value="homme-pulls">Pulls & Sweats</option>
                <option value="homme-vestes">Vestes & Manteaux</option>
                <option value="homme-sous-vetements">Sous-vêtements</option>
              </optgroup>
              <optgroup label="👗 Vêtements Femme">
                <option value="femme-robes">Robes</option>
                <option value="femme-jupes">Jupes</option>
                <option value="femme-pantalons">Pantalons</option>
                <option value="femme-tops">Tops & Blouses</option>
                <option value="femme-pulls">Pulls & Cardigans</option>
                <option value="femme-vestes">Vestes & Manteaux</option>
                <option value="femme-lingerie">Lingerie</option>
              </optgroup>
              <optgroup label="👟 Chaussures">
                <option value="chaussures-homme">Chaussures Homme</option>
                <option value="chaussures-femme">Chaussures Femme</option>
                <option value="baskets">Baskets & Sneakers</option>
                <option value="chaussures-sport">Chaussures de Sport</option>
                <option value="sandales">Sandales & Tongs</option>
                <option value="bottes">Bottes & Bottines</option>
              </optgroup>
              <optgroup label="👜 Accessoires">
                <option value="sacs-main">Sacs à Main</option>
                <option value="sacs-dos">Sacs à Dos</option>
                <option value="portefeuilles">Portefeuilles</option>
                <option value="ceintures">Ceintures</option>
                <option value="montres">Montres</option>
                <option value="bijoux">Bijoux</option>
              </optgroup>
              <optgroup label="🕶️ Lunettes">
                <option value="lunettes-soleil">Lunettes de Soleil</option>
                <option value="lunettes-vue">Lunettes de Vue</option>
                <option value="lunettes-sport">Lunettes de Sport</option>
              </optgroup>
              <optgroup label="🎒 Maroquinerie">
                <option value="valises">Valises & Bagages</option>
                <option value="sacs-voyage">Sacs de Voyage</option>
                <option value="pochettes">Pochettes & Clutchs</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="form-textarea"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Prix (€) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imageFile">Image du produit</label>
          <div className="image-input-container">
            <div className="image-input-actions">
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input-visible"
              />
              <button
                type="button"
                onClick={() => document.getElementById('imageFile')?.click()}
                className="btn-file-select"
              >
                📁 Choisir une image
              </button>
              {formData.imageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                    // Reset du input file
                    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                    console.log('Image supprimée');
                  }}
                  className="btn-file-clear"
                >
                  🗑️ Supprimer
                </button>
              )}
            </div>
          </div>
          {formData.imageUrl && (
            <div className="image-preview">
              <p>Aperçu de l'image :</p>
              <img 
                src={formData.imageUrl} 
                alt="Aperçu" 
                className="preview-image"
                onLoad={() => console.log('Image chargée avec succès')}
                onError={(e) => {
                  console.error('Erreur de chargement image:', e);
                }}
              />
              <p>Taille: {(formData.imageUrl.length / 1024).toFixed(1)} KB</p>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="form-checkbox"
            />
            Produit actif
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            {product ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}