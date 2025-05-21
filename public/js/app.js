import { Store } from './core/store.js';
import { API } from './core/api.js';
import { CartModule } from './modules/cart.module.js';
import { validateCart, validateProduct } from './utils/cart-validator.js';

class App {
  constructor() {
    this.store = new Store({
      cart: [],
      user: null
    });
    
    this.modules = {
      cart: null
    };
    
    this.init();
  }

  async init() {
    try {
      // Инициализация модулей
      this.initializeModules();
      
      // Загрузка данных пользователя (если нужно)
      await this.loadUserData();
      
      // Инициализация UI
      this.setupEventListeners();
      
    } catch (error) {
      this.handleGlobalError(error);
    }
  }

  initializeModules() {
    // Инициализация модуля корзины с передачей зависимостей
    this.modules.cart = new CartModule(
      this.store,
      {
        validateCart,
        validateProduct
      }
    );
  }

  async loadUserData() {
    try {
      const user = await API.getCurrentUser();
      this.store.commit('SET_USER', user);
    } catch (error) {
      console.warn('Не удалось загрузить данные пользователя:', error);
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