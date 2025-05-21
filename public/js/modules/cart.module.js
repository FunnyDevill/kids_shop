import { Store } from '../core/store.js';
import { API } from '../core/api.js';
import { validateCart } from '../utils/cart-validator.js';

export class CartModule {
  constructor(store) {
    this.store = store;
    this.validator = validateCart; // Просто присваиваем функцию, не создаем экземпляр
    this.init();
  }

  // ... остальной код остается без изменений ...

  async handleAddToCart(productId) {
    try {
      const product = await API.getProduct(productId);
      this.validator(product); // Вызываем как функцию, а не метод
      
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

  async handleCheckout() {
    try {
      this.validator(this.store.state.cart); // Вызываем как функцию
      
      const order = await API.createOrder({
        items: this.store.state.cart,
        userId: this.store.state.user?.id
      });
      
      // ... остальной код ...
    } catch (error) {
      this.handleCartError(error);
    }
  }
}