class ComponentLoader {
  constructor(options = {}) {
    // Настройки по умолчанию
    this.defaults = {
      componentAttr: 'data-component',
      loadedAttr: 'data-component-loaded',
      componentsPath: 'js/components/'
    };

    // Слияние настроек
    this.settings = { ...this.defaults, ...options };

    // Зарегистрированные компоненты
    this.componentsRegistry = new Map();

    // Инициализация
    this.init();
  }

  init() {
    // Загрузка компонентов при полной загрузке DOM
    if (document.readyState === 'complete') {
      this.loadComponents();
    } else {
      document.addEventListener('DOMContentLoaded', () => this.loadComponents());
    }
  }

  /**
   * Регистрация компонента
   * @param {string} name - Имя компонента
   * @param {class} componentClass - Класс компонента
   */
  registerComponent(name, componentClass) {
    this.componentsRegistry.set(name, componentClass);
  }

  /**
   * Загрузка всех компонентов на странице
   */
  async loadComponents() {
    const components = document.querySelectorAll(`[${this.settings.componentAttr}]`);

    for (const element of components) {
      if (element.hasAttribute(this.settings.loadedAttr)) continue;

      const componentName = element.getAttribute(this.settings.componentAttr);
      await this.loadComponent(element, componentName);
    }
  }

  /**
   * Загрузка конкретного компонента
   * @param {HTMLElement} element - DOM элемент
   * @param {string} componentName - Имя компонента
   */
  async loadComponent(element, componentName) {
    try {
      // Проверка регистрации компонента
      if (this.componentsRegistry.has(componentName)) {
        const ComponentClass = this.componentsRegistry.get(componentName);
        new ComponentClass(element);
        element.setAttribute(this.settings.loadedAttr, 'true');
        return;
      }

      // Динамическая загрузка компонента
      const modulePath = `${this.settings.componentsPath}${componentName}.component.js`;
      const module = await import(modulePath);
      
      if (module.default) {
        this.registerComponent(componentName, module.default);
        new module.default(element);
        element.setAttribute(this.settings.loadedAttr, 'true');
      } else {
        console.error(`Component ${componentName} has no default export`, module);
      }
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
    }
  }

  /**
   * Загрузка конкретного компонента по имени
   * @param {string} componentName - Имя компонента
   */
  async loadComponentByName(componentName) {
    const elements = document.querySelectorAll(
      `[${this.settings.componentAttr}="${componentName}"]:not([${this.settings.loadedAttr}])`
    );

    for (const element of elements) {
      await this.loadComponent(element, componentName);
    }
  }
}

// Создаем экземпляр загрузчика
const componentLoader = new ComponentLoader();

// Регистрируем базовые компоненты
componentLoader.registerComponent('cart', class {
  constructor(element) {
    this.element = element;
    this.init();
  }
  
  init() {
    console.log('Cart component initialized', this.element);
    // Реализация компонента корзины
  }
});

// Экспорт для использования в других модулях
export default componentLoader;

// Глобальная доступность (опционально)
window.ComponentLoader = componentLoader;