import { API_URL } from '../config/api';
import type { User, AuthResponse, LoginCredentials, RegisterData } from '../types/Auth';

const API_BASE_URL = API_URL || 'http://localhost:3000';

class AuthService {
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'auth_user';

  // Inscription
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }

    const data: AuthResponse = await response.json();
    
    // Stocker le token et l'utilisateur
    this.setToken(data.access_token);
    this.setUser(data.user);
    
    return data;
  }

  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la connexion');
    }

    const data: AuthResponse = await response.json();
    
    console.log('Login response from backend:', data); // Debug
    console.log('User from backend:', data.user); // Debug
    
    // Stocker le token et l'utilisateur
    this.setToken(data.access_token);
    this.setUser(data.user);
    
    return data;
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Vérifier si le token n'est pas expiré
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Obtenir le token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Stocker le token
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtenir l'utilisateur connecté
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Stocker l'utilisateur
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Obtenir les headers avec le token
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();

// Re-export des types pour la compatibilité
export type { User, AuthResponse, LoginCredentials, RegisterData } from '../types/Auth';