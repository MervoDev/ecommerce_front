import { useState } from 'react';

interface AdminLoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onBackToShop: () => void;
  error?: string;
}

export function AdminLogin({ onLogin, onBackToShop, error }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Administration</h1>
          <p>Connexion requise pour accéder au panneau d'administration</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="login-btn">
            Se connecter
          </button>
        </form>

        <div className="login-footer">
          <button onClick={onBackToShop} className="back-link">
            ← Retour à la boutique
          </button>
        </div>
      </div>
    </div>
  );
}