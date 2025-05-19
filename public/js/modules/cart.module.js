import { Store } from '../core/store.js';
import { API } from '../core/api.js';
import { validateCart } from '../utils/cart-validator.js';

export class CartModule {
  constructor(store) {
    this.store = store;
    this.validator = new validateCart();
    this.init();
  }

  init() {
    this.bindEvents();
    this.store.subscribe(state => this.render(state.cart));
  }

  bindEvents() {
    document.addEventListener('click', async e => {
      if (e.target.matches('[data-add-to-cart]')) {
        await this.handleAddToCart(e.target.dataset.productId);
      }
      if (e.target.matches('[data-remove-item]')) {
        this.handleRemoveItem(e.target.dataset.itemId);
      }
      if (e.target.matches('[data-checkout]')) {
        await this.handleCheckout();
      }
    });
  }

  async handleAddToCart(productId) {
    try {
      const product = await API.getProduct(productId);
      this.validator.validateProduct(product);
      
      this.store.commit('ADD_TO_CART', {
        ...product,
        quantity: 1,
        addedAt: Date.now()
      });
      
      this.showNotification(`${product.name} добавлен в корзину`, 'success');
    } catch (error) {
      this.handleCartError(error);
    }
  }

  handleRemoveItem(itemId) {
    this.store.commit('REMOVE_FROM_CART', itemId);
    this.showNotification('Товар удалён из корзины', 'warning');
  }

  async handleCheckout() {
    try {
      this.validator.validateCart(this.store.state.cart);
      
      const order = await API.createOrder({
        items: this.store.state.cart,
        userId: this.store.state.user?.id
      });
      
      this.store.commit('CLEAR_CART');
      this.showNotification(`Заказ #${order.id} оформлен!`, 'success');
      this.closeCart();
    } catch (error) {
      this.handleCartError(error);
    }
  }

  render(cartItems) {
    const container = document.querySelector('[data-cart-items]');
    if (!container) return;

    container.innerHTML = cartItems.map(item => `
      <div class="cart-item" data-item-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="item-info">
          <h4>${item.name}</h4>
          <div class="item-controls">
            <button data-remove-item="${item.id}">×</button>
          </div>
        </div>
      </div>
    `).join('');

    this.updateTotal();
    this.toggleCheckoutButton();
  }

  updateTotal() {
    const total = this.store.state.cart.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
    document.querySelector('[data-cart-total]').textContent = `${total} ₽`;
  }

  toggleCheckoutButton() {
    const btn = document.querySelector('[data-checkout]');
    btn.disabled = this.store.state.cart.length === 0;
  }

  handleCartError(error) {
    console.error('Cart Error:', error);
    this.showNotification(error.message, 'error');
  }

  closeCart() {
    document.getElementById('cart-sidebar').setAttribute('hidden', 'true');
  }

  showNotification(message, type) {
    const event = new CustomEvent('notify', { 
      detail: { message, type } 
    });
    document.dispatchEvent(event);
  }
}