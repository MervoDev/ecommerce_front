interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (categoryId?: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <select
        value={selectedCategory || ''}
        onChange={(e) => onCategoryChange(e.target.value || undefined)}
        className="category-select"
      >
        <option value="">Toutes les catégories</option>
        
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
  );
}