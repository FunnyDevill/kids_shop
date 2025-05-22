import { Store } from './core/store.js';
import { API } from './core/api.js';
import { CartModule } from './modules/cart.module.js';
import { validateCart, validateProduct } from './utils/cart-validator.js';

console.log('Script loaded');

class App {
  constructor() {
    this.init().catch(error => {
      console.error('App initialization failed:', error);
    });
  }

  async init() {
    try {
      await Promise.all([
        this.loadUserData(),
        this.loadHeroImage() // Новая функция для контроля загрузки изображения
      ]);
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async loadHeroImage() {
    return new Promise((resolve) => {
      const heroImg = document.querySelector('.hero img');
      if (heroImg.complete) {
        resolve();
      } else {
        heroImg.onload = resolve;
        heroImg.onerror = () => {
          console.warn('Hero image failed to load');
          resolve();
        };
      }
    });
  }

  async loadUserData() {
    try {
      this.user = await API.getCurrentUser();
      console.log('User loaded:', this.user);
    } catch (error) {
      console.error('Failed to load user:', error);
      this.user = null;
    }
  }

  setupEventListeners() {
    document.addEventListener('notify', (event) => {
      this.showNotification(event.detail.message, event.detail.type);
    });
  }

  showNotification(message, type = 'info') {
    // Реализация показа уведомлений
    console[type](message);
    // Можно интегрировать с UI библиотекой уведомлений
  }

  handleGlobalError(error) {
    console.error('Global Error:', error);
    this.showNotification(error.message, 'error');
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  new App();
});