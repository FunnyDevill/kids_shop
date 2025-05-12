export class Router {
    constructor(routes, rootElement) {
      this.routes = routes;
      this.root = rootElement || document.getElementById('app');
      this.currentRoute = null;
      this.params = {};
  
      // Привязка контекста
      this.handleUrlChange = this.handleUrlChange.bind(this);
      this.handleLinkClick = this.handleLinkClick.bind(this);
  
      this.init();
    }
  
    init() {
      // Слушаем события навигации
      window.addEventListener('popstate', this.handleUrlChange);
      document.addEventListener('click', this.handleLinkClick);
      
      // Первоначальная загрузка
      this.handleUrlChange();
    }
  
    async handleUrlChange() {
      const path = this.getCurrentPath();
      const matchedRoute = this.matchRoute(path);
  
      if (!matchedRoute) {
        this.showErrorPage();
        return;
      }
  
      // Обновляем параметры
      this.params = matchedRoute.params;
      
      // Загрузка и рендер компонента
      try {
        const component = await this.loadComponent(matchedRoute.component);
        this.renderComponent(component);
        this.updateDocumentMeta(matchedRoute.meta);
      } catch (error) {
        console.error('Route load failed:', error);
        this.showErrorPage();
      }
    }
  
    matchRoute(path) {
      return this.routes.find(route => {
        const regex = new RegExp(`^${route.path.replace(/:\w+/g, '([\\w-]+)')}$`);
        const match = path.match(regex);
        
        if (match) {
          route.params = this.extractParams(route.path, match);
          return true;
        }
        return false;
      });
    }
  
    extractParams(routePath, match) {
      const params = {};
      const paramNames = [...routePath.matchAll(/:(\w+)/g)].map(m => m[1]);
      
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
  
      return params;
    }
  
    async loadComponent(componentPath) {
      try {
        const { default: component } = await import(`../../views/${componentPath}.js`);
        return component;
      } catch (error) {
        throw new Error(`Component ${componentPath} not found`);
      }
    }
  
    renderComponent(component) {
      this.root.innerHTML = component(this.params);
    }
  
    updateDocumentMeta(meta = {}) {
      document.title = meta.title || 'Midnight Dream';
      document.querySelector('meta[name="description"]')
        ?.setAttribute('content', meta.description || '');
    }
  
    handleLinkClick(e) {
      const link = e.target.closest('a[data-router]');
      if (!link) return;
  
      e.preventDefault();
      this.navigateTo(link.href);
    }
  
    navigateTo(path) {
      window.history.pushState(null, null, path);
      this.handleUrlChange();
    }
  
    getCurrentPath() {
      return window.location.pathname;
    }
  
    showErrorPage() {
      this.root.innerHTML = '<h1>404</h1><p>Страница не найдена</p>';
    }
  
    destroy() {
      window.removeEventListener('popstate', this.handleUrlChange);
      document.removeEventListener('click', this.handleLinkClick);
    }
  }