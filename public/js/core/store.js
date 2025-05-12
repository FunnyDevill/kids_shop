export class Store {
    constructor() {
      this.state = {
        user: JSON.parse(localStorage.getItem('user')),
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        products: []
      };
      this.listeners = [];
    }
  
    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
  
    commit(mutation, payload) {
      switch(mutation) {
        case 'ADD_TO_CART':
          this._addToCart(payload);
          break;
        case 'REMOVE_FROM_CART':
          this._removeFromCart(payload);
          break;
        case 'SET_USER':
          this._setUser(payload);
          break;
      }
      this._saveState();
      this._notifyListeners();
    }
  
    _addToCart(product) {
      const existing = this.state.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.state.cart.push({ ...product, quantity: 1 });
      }
    }
  
    _setUser(user) {
      this.state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    }
  
    _saveState() {
      localStorage.setItem('cart', JSON.stringify(this.state.cart));
    }
  
    _notifyListeners() {
      this.listeners.forEach(listener => listener(this.state));
    }
  }