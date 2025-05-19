// Импорт основных модулей
import { Store } from './core/store.js';
import { ComponentLoader } from './core/component-loader.js';
import { Router } from './core/router.js';
import { CartModule } from './modules/cart.module.js';
import { AuthModule } from './modules/auth.module.js';
import { routes } from './utils/routes.js';

// Главный класс приложения
class App {
  constructor() {
    // Инициализация состояния
    this.store = new Store();
    
    // Регистрация модулей
    this.modules = {
      cart: null,
      auth: null,
      router: null
    };

    // Привязка контекста
    this.init = this.init.bind(this);
    this.handleGlobalError = this.handleGlobalError.bind(this);
  }

  /**
   * Инициализация приложения
   */
  async init() {
    try {
      // 1. Загрузка компонентов интерфейса
      await ComponentLoader.loadAll();

      // 2. Инициализация модулей
      this.initializeModules();

      // 3. Настройка глобальных обработчиков
      this.setupGlobalHandlers();

      // 4. Восстановление сессии
      await this.restoreSession();

      console.log('Application initialized successfully');
    } catch (error) {
      this.handleGlobalError(error);
    }
  }

  /**
   * Инициализация основных модулей
   */
  initializeModules() {
    this.modules = {
      cart: new CartModule(this.store),
      auth: new AuthModule(this.store),
      router: new Router({
        routes,
        rootElement: document.querySelector('#main-content'),
        store: this.store
      })
    };
  }

  /**
   * Настройка глобальных обработчиков
   */
  setupGlobalHandlers() {
    // Глобальные ошибки
    window.addEventListener('error', this.handleGlobalError);
    
    // Навигация
    window.addEventListener('popstate', () => this.modules.router.handleUrlChange());
    
    // Клики по ссылкам
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-internal]');
      if (link) {
        e.preventDefault();
        this.modules.router.navigateTo(link.href);
      }
    });
  }

  /**
   * Восстановление пользовательской сессии
   */
  async restoreSession() {
    if (this.store.state.user) {
      try {
        // Проверка валидности токена
        const isValid = await this.modules.auth.checkToken();
        if (!isValid) {
          this.store.commit('LOGOUT');
        }
      } catch (error) {
        this.store.commit('LOGOUT');
      }
    }
  }

  /**
   * Обработчик глобальных ошибок
   */
  handleGlobalError(error) {
    console.error('Global Error Handler:', error);
    this.showNotification(
      error.message || 'Произошла непредвиденная ошибка',
      'error'
    );
    
    // Отправка ошибки в систему мониторинга
    if (process.env.NODE_ENV === 'production') {
      window.trackError(error);
    }
  }

  /**
   * Показать уведомление
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <svg class="icon"><use href="#${type}-icon"></use></svg>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }
}

// Инициализация и запуск приложения
const app = new App();

document.addEventListener('DOMContentLoaded', () => {
  app.init().catch(error => {
    document.body.innerHTML = `
      <h1>Ошибка инициализации</h1>
      <p>${error.message}</p>
      <button onclick="location.reload()">Перезагрузить</button>
    `;
  });
});

// Экспорт для отладки
if (process.env.NODE_ENV === 'development') {
  window.app = app;
}