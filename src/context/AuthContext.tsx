import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import type { User, LoginCredentials, RegisterData } from '../types/Auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fonction pour vérifier l'authentification
  const checkAuth = () => {
    try {
      // Vérifier d'abord via authService
      let authenticated = authService.isAuthenticated();
      let currentUser = authService.getCurrentUser();
      
      // Si pas d'utilisateur via authService, vérifier localStorage directement
      if (!currentUser) {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          try {
            currentUser = JSON.parse(savedUser);
            authenticated = true;
          } catch (e) {
            console.error('Erreur lors du parsing de auth_user:', e);
          }
        }
      }
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
      return { authenticated, currentUser };
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setIsAuthenticated(false);
      setUser(null);
      return { authenticated: false, currentUser: null };
    }
  };

  useEffect(() => {
    // Vérifier l'authentification au chargement
    checkAuth();
    setLoading(false);
    
    // Écouter les changements de localStorage (pour synchroniser entre onglets et après connexion)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier aussi périodiquement (au cas où)
    const interval = setInterval(() => {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser && !user) {
        checkAuth();
      }
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error; // Propager l'erreur pour que le composant puisse la gérer
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error; // Propager l'erreur pour que le composant puisse la gérer
    }
  };

  const logout = () => {
    authService.logout();
    // Supprimer aussi les autres clés du localStorage
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('adminUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};