export class API {
  static BASE_URL = 'http://localhost:3000/api';
  static MOCK_MODE = false;
  static MOCK_HANDLERS = {};

  static async request(endpoint, options = {}) {
    // Проверка мок-режима
    if (this.MOCK_MODE && this.MOCK_HANDLERS[endpoint]) {
      console.log(`[MOCK] ${endpoint}`);
      return this.MOCK_HANDLERS[endpoint](options);
    }

    // Конфигурация запроса
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include',
      ...options
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth Methods
  static login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials
    });
  }

  static getCurrentUser() {
    return this.request('/users/me');
  }

  // Product Methods
  static getProducts(category = null) {
    const url = category ? `/products?category=${category}` : '/products';
    return this.request(url);
  }

  // Cart Methods
  static getCart() {
    return this.request('/cart');
  }

  // Mock System
  static enableMockMode() {
    if (process.env.NODE_ENV === 'development' || 
        window.location.hostname === 'localhost') {
      this.MOCK_MODE = true;
      
      this.MOCK_HANDLERS = {
        '/users/me': () => ({
          id: 1,
          name: "Test User",
          email: "test@example.com"
        }),
        '/products': () => ({
          products: [
            { id: 1, name: "Детская куртка", price: 1999 },
            { id: 2, name: "Игрушка", price: 599 }
          ]
        }),
        '/cart': () => ({
          items: [
            { productId: 1, quantity: 2 }
          ],
          total: 3998
        })
      };
      
      console.log('[API] Mock mode activated');
    }
  }
}

// Автоматическое включение моков в development
API.enableMockMode();