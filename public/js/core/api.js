// core/api.js
import { Store } from './store.js';

const API_BASE_URL = 'https://api.midnightdream.ru/v1';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export class API {
  static async request(endpoint, options = {}) {
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
      console.error('API Error:', error);
      throw error;
    }
  }

  // Авторизация
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

  // Продукты
  static async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  static async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products?${query}`);
  }

  // Корзина
  static async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  static async getCart() {
    return this.request('/cart');
  }

  // Пользователи
  static async updateProfile(userId, data) {
    return this.request(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // Админка
  static async adminGetOrders() {
    return this.request('/admin/orders');
  }

  // Мок-режим для разработки
  static enableMockMode() {
    if (process.env.NODE_ENV === 'development') {
      import('./api.mock.js').then(mock => mock.enable());
    }
  }
}

// Инициализация моков в разработке
if (process.env.NODE_ENV === 'development') {
  API.enableMockMode();
}