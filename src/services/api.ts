import type { Category, Product } from '../types/Product';

const API_BASE_URL = 'http://localhost:3000'; 

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
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
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify({
        ...productData,
        userEmail: adminUser.email
      }),
    });
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...productData,
        userEmail: adminUser.email
      }),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        userEmail: adminUser.email
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

  // Cart Items API
  async addCartItem(cartId: number, productId: number, quantity: number, unitPrice: number) {
    return this.request('/cart-items', {
      method: 'POST',
      body: JSON.stringify({ cartId, productId, quantity, unitPrice }),
    });
  }

  async getCartItems(cartId: number) {
    return this.request(`/cart-items/cart/${cartId}`);
  }

  async updateCartItemQuantity(id: number, quantity: number) {
    return this.request(`/cart-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(id: number) {
    return this.request(`/cart-items/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();