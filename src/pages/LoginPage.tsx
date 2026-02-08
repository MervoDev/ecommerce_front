import { useState } from 'react';

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onBackToShop: () => void;
  onGoToRegister: () => void;
  error?: string;
}

export function LoginPage({ onLogin, onBackToShop, onGoToRegister, error }: LoginPageProps) {
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
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte</p>
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
              placeholder="votre@email.com"
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
          <p style={{ textAlign: 'center', margin: '1rem 0', color: '#6b7280' }}>
            Pas encore de compte ?{' '}
            <button 
              onClick={onGoToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: '#ec4899',
                cursor: 'pointer',
                fontWeight: '600',
                textDecoration: 'underline'
              }}
            >
              Créer un compte
            </button>
          </p>
          <button onClick={onBackToShop} className="back-link">
            ← Retour à la boutique
          </button>
        </div>
      </div>
    </div>
  );
}
