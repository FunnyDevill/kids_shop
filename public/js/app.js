import { API } from './api.js';

export class App {
  constructor() {
    this.state = {
      user: null,
      products: [],
      cart: null,
      loading: true,
      error: null
    };
    
    this.init();
  }

  async init() {
    try {
      // Загрузка начальных данных
      await this.loadInitialData();
      
      // Инициализация UI
      this.render();
      this.setupEventListeners();
      
      console.log('App initialized');
    } catch (error) {
      console.error('App initialization failed:', error);
      this.setState({ error: error.message, loading: false });
    }
  }

  async loadInitialData() {
    this.setState({ loading: true });
    
    try {
      const [user, products, cart] = await Promise.all([
        API.getCurrentUser(),
        API.getProducts(),
        API.getCart()
      ]);
      
      this.setState({ user, products, cart, loading: false });
    } catch (error) {
      this.setState({ 
        error: 'Не удалось загрузить данные',
        loading: false 
      });
      throw error;
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    const { user, products, cart, loading, error } = this.state;
    
    // Основной рендеринг
    document.getElementById('app').innerHTML = `
      <header>
        ${user ? `Привет, ${user.name}!` : 'Войдите в систему'}
      </header>
      
      <main>
        ${loading ? '<div class="loader">Загрузка...</div>' : ''}
        ${error ? `<div class="error">${error}</div>` : ''}
        
        <div class="products">
          ${products.map(p => `
            <div class="product">
              <h3>${p.name}</h3>
              <p>${p.price} руб.</p>
            </div>
          `).join('')}
        </div>
      </main>
      
      <aside class="cart">
        ${cart ? `Товаров: ${cart.items.length}` : 'Корзина пуста'}
      </aside>
    `;
  }

  setupEventListeners() {
    // Обработчики событий UI
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        this.addToCart(e.target.dataset.id);
      }
    });
  }

  async addToCart(productId) {
    try {
      this.setState({ loading: true });
      // Реальная реализация будет использовать API
      const updatedCart = await API.addToCart(productId);
      this.setState({ cart: updatedCart });
    } catch (error) {
      this.setState({ error: 'Ошибка добавления в корзину' });
    } finally {
      this.setState({ loading: false });
    }
  }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  new App();
});