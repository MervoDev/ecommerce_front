import type { Category, Product } from '../types/Product';
import { API_URL } from '../config/api';
import { authService } from './authService';

const API_BASE_URL = API_URL || 'http://localhost:3000'; 

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(), // Ajouter automatiquement le token
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Si erreur 401, l'utilisateur n'est pas authentifié
      if (response.status === 401) {
        authService.logout();
        throw new Error('Vous devez vous connecter pour effectuer cette action');
      }
      
      // Essayer de récupérer le message d'erreur du backend
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = `Erreur: ${errorData.message}`;
        }
      } catch (e) {
        // Si on ne peut pas parser le JSON, garder le message par défaut
      }
      
      throw new Error(errorMessage);
    }

    // Pour les DELETE, ne pas essayer de parser JSON si la réponse est vide
    if (options?.method === 'DELETE' && response.status === 204) {
      return undefined as T;
    }

    // Vérifier s'il y a du contenu à parser
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : undefined as T;
    }

    return undefined as T;
  }

  // Products API
  async getProducts(filters?: { category?: number | string; search?: string }): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category.toString());
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Product[]>(endpoint);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    // Récupérer l'utilisateur connecté (admin)
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const userEmail = authUser.email || adminUser.email;
    
    if (!userEmail) {
      throw new Error('Vous devez être connecté en tant qu\'administrateur');
    }
    
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify({
        ...productData,
        userEmail
      }),
    });
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    // Récupérer l'utilisateur connecté (admin)
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const userEmail = authUser.email || adminUser.email;
    
    if (!userEmail) {
      throw new Error('Vous devez être connecté en tant qu\'administrateur');
    }
    
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...productData,
        userEmail
      }),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    // Récupérer l'utilisateur connecté (admin)
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const userEmail = authUser.email || adminUser.email;
    
    if (!userEmail) {
      throw new Error('Vous devez être connecté en tant qu\'administrateur');
    }
    
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        userEmail
      }),
    });
  }

  // Orders API
  async createOrder(): Promise<any> {
    return this.request<any>('/orders', {
      method: 'POST',
    });
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async getCategory(id: number): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  async getCategoryProducts(id: number): Promise<Product[]> {
    return this.request<Product[]>(`/categories/${id}/products`);
  }

  // Cart API
  async createCart(userId: number) {
    return this.request('/carts', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getCart(id: number) {
    return this.request(`/carts/${id}`);
  }

  async getUserCart(userId: number) {
    return this.request(`/carts/user/${userId}`);
  }

  async updateCartTotal(id: number, totalAmount: number) {
    return this.request(`/carts/${id}/total`, {
      method: 'PUT',
      body: JSON.stringify({ totalAmount }),
    });
  }

  // Cart Items API - PROTÉGÉS PAR AUTHENTIFICATION
  async addCartItem(cartId: number, productId: number, quantity: number, unitPrice: number) {
    // Vérifier l'authentification avant d'ajouter au panier
    if (!authService.isAuthenticated()) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    return this.request('/cart-items', {
      method: 'POST',
      body: JSON.stringify({ cartId, productId, quantity, unitPrice }),
    });
  }

  async getCartItems(cartId: number) {
    if (!authService.isAuthenticated()) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    return this.request(`/cart-items/cart/${cartId}`);
  }

  async updateCartItemQuantity(id: number, quantity: number) {
    if (!authService.isAuthenticated()) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    return this.request(`/cart-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(id: number) {
    if (!authService.isAuthenticated()) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    return this.request(`/cart-items/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();