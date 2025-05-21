/**
 * Модуль корзины товаров
 */
class CartModule {
  constructor(options = {}) {
    // Настройки по умолчанию
    this.defaults = {
      cartSelector: '#cart',
      cartItemSelector: '.cart-item',
      addToCartSelector: '.add-to-cart',
      removeFromCartSelector: '.remove-from-cart',
      cartTotalSelector: '.cart-total',
      storageKey: 'kids_shop_cart'
    };

    // Слияние настроек
    this.settings = { ...this.defaults, ...options };

    // Инициализация
    this.init();
  }

  init() {
    // Инициализация корзины
    this.cart = this.loadCart();
    this.bindEvents();
    this.updateCart();
  }

  bindEvents() {
    // Делегирование событий для динамически добавляемых элементов
    document.addEventListener('click', (e) => {
      // Обработка добавления в корзину
      if (e.target.closest(this.settings.addToCartSelector)) {
        const button = e.target.closest(this.settings.addToCartSelector);
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productPrice = parseFloat(button.dataset.productPrice);
        this.addToCart(productId, productName, productPrice);
      }

      // Обработка удаления из корзины
      if (e.target.closest(this.settings.removeFromCartSelector)) {
        const button = e.target.closest(this.settings.removeFromCartSelector);
        const productId = button.dataset.productId;
        this.removeFromCart(productId);
      }
    });
  }

  loadCart() {
    // Загрузка корзины из localStorage
    const cartJson = localStorage.getItem(this.settings.storageKey);
    return cartJson ? JSON.parse(cartJson) : [];
  }

  saveCart() {
    // Сохранение корзины в localStorage
    localStorage.setItem(this.settings.storageKey, JSON.stringify(this.cart));
  }

  addToCart(id, name, price, quantity = 1) {
    // Добавление товара в корзину
    const existingItem = this.cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ id, name, price, quantity });
    }

    this.saveCart();
    this.updateCart();
    this.showNotification(`Товар "${name}" добавлен в корзину`);
  }

  removeFromCart(id) {
    // Удаление товара из корзины
    this.cart = this.cart.filter(item => item.id !== id);
    this.saveCart();
    this.updateCart();
  }

  updateCart() {
    // Обновление отображения корзины
    const cartElement = document.querySelector(this.settings.cartSelector);
    if (!cartElement) return;

    // Обновление списка товаров
    const itemsContainer = cartElement.querySelector('.cart-items');
    if (itemsContainer) {
      itemsContainer.innerHTML = this.cart.map(item => `
        <div class="${this.settings.cartItemSelector.substring(1)}" data-product-id="${item.id}">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">${item.price} ₽</span>
          <span class="cart-item-quantity">× ${item.quantity}</span>
          <button class="${this.settings.removeFromCartSelector.substring(1)}" data-product-id="${item.id}">
            Удалить
          </button>
        </div>
      `).join('');
    }

    // Обновление общей суммы
    const totalElement = document.querySelector(this.settings.cartTotalSelector);
    if (totalElement) {
      const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      totalElement.textContent = `${total.toFixed(2)} ₽`;
    }
  }

  showNotification(message) {
    // Показ уведомления
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // Дополнительные методы
  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCart();
  }
}

// Экспорт для использования в других модулях
export default CartModule;