// core/api.js
import { Store } from './store.js';

const API_BASE_URL = 'https://api.midnightdream.ru/v1';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Конфигурация окружения
const ENV = (() => {
  try {
    // Для сборок (Webpack/Vite)
    return {
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production'
    };
  } catch (e) {
    // Fallback для чистого браузера
    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return {
      isDevelopment: isLocalhost,
      isProduction: !isLocalhost
    };
  }
})();

export class API {
  // Мок-система
  static _mocksEnabled = false;
  static _mockHandlers = {
    '/auth/me': async () => ({
    id: 1,
    email: 'test@example.com',
    name: 'Test User'
  }),
  };

  static async getCurrentUser() {
  return this.request('/auth/me');
}
  
  static async request(endpoint, options = {}) {
    // Обработка моков
    if (this._mocksEnabled && this._mockHandlers[endpoint]) {
      try {
        const mockResponse = await this._mockHandlers[endpoint](options);
        console.log(`[API Mock] ${endpoint}`, mockResponse);
        return mockResponse;
      } catch (error) {
        console.error(`[API Mock Error] ${endpoint}`, error);
        throw error;
      }
    }

    // Реальный запрос
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...DEFAULT_HEADERS,
      ...options.headers
    };

    // Добавляем токен авторизации
    const token = Store.state.token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include'
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('[API Error]', error);
      throw error;
    }
  }

  // ========== Auth Methods ========== //
  static async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  static async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  static async checkAuth() {
    return this.request('/auth/me');
  }

  static async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  // ========== Product Methods ========== //
  static async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  static async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products?${query}`);
  }

  static async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  // ========== Cart Methods ========== //
  static async getCart() {
    return this.request('/cart');
  }

  static async addToCart(productId, quantity = 1) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  static async removeFromCart(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE'
    });
  }

  static async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // ========== User Methods ========== //
  static async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  static async updateProfile(userId, data) {
    return this.request(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // ========== Admin Methods ========== //
  static async adminGetOrders() {
    return this.request('/admin/orders');
  }

  static async adminUpdateOrder(orderId, status) {
    return this.request(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // ========== Mock System ========== //
  static enableMockMode() {
    if (ENV.isDevelopment) {
      this._mocksEnabled = true;
      
      // Базовые моки
      this._mockHandlers = {
        '/auth/login': async ({ body }) => {
          const { email, password } = JSON.parse(body);
          if (email === 'test@example.com' && password === 'password123') {
            return {
              token: 'mock-jwt-token',
              user: { id: 1, email, name: 'Test User' }
            };
          }
          throw new Error('Invalid credentials');
        },
        '/auth/me': async () => ({
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        }),
        '/products': async () => ({
          products: [
            { id: 1, name: 'Mock Product 1', price: 99.99 },
            { id: 2, name: 'Mock Product 2', price: 199.99 }
          ]
        }),
        '/cart': async () => ({
          items: [
            { id: 1, productId: 1, quantity: 2 },
            { id: 2, productId: 2, quantity: 1 }
          ],
          total: 399.97
        })
      };
      
      console.log('[API] Mock mode activated');
    }
  }

  static disableMockMode() {
    this._mocksEnabled = false;
    console.log('[API] Mock mode disabled');
  }

  static addMockHandler(endpoint, handler) {
    this._mockHandlers[endpoint] = handler;
  }
}

// Автоматически включаем моки в development
if (ENV.isDevelopment) {
  API.enableMockMode();
}