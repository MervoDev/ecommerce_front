export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h3>Notre Boutique</h3>
          <p>Votre boutique en ligne de confiance pour la mode et les accessoires.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul>
            <li><a href="#">Accueil</a></li>
            <li><a href="#">Produits</a></li>
            <li><a href="#">Catégories</a></li>
            <li><a href="#">Promotions</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h4>Service client</h4>
          <ul>
            <li><a href="#">Aide & Support</a></li>
            <li><a href="#">Livraison</a></li>
            <li><a href="#">Retours</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h4>Légal</h4>
          <ul>
            <li><a href="#">Conditions d'utilisation</a></li>
            <li><a href="#">Politique de confidentialité</a></li>
            <li><a href="#">Mentions légales</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <div className="contact-info">
            <p>📧 floratogbonon@gmail.com</p>
            <p>📞 +229 01 43 09 41 36</p>
            <p>📍 AGLA, Cotonou Bénin</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2026 Notre Boutique. Tous droits réservés.</p>
          <div className="payment-methods">
            <span>📱 MTN MoMo</span>
            <span>📱 Moov Money</span>
            <span>📱 Celtiis Cash</span>
            <span>💳 PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}