import { Store } from '../core/store.js';
import { API } from '../core/api.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

export class AuthModule {
  constructor(store) {
    this.store = store;
    this.init();
  }

  init() {
    this.bindEvents();
    this.restoreSession();
    this.store.subscribe(state => this.updateUI(state.user));
  }

  bindEvents() {
    document.addEventListener('submit', async e => {
      if (e.target.matches('#login-form')) {
        e.preventDefault();
        await this.handleLogin(e.target);
      }
      if (e.target.matches('#register-form')) {
        e.preventDefault();
        await this.handleRegistration(e.target);
      }
    });
  }

  async handleLogin(form) {
    try {
      const formData = new FormData(form);
      const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      this.validateCredentials(credentials);
      
      const { user, token } = await API.login(credentials);
      this.store.commit('SET_USER', user);
      this.store.commit('SET_TOKEN', token);
      
      this.closeModal();
      this.showNotification('Успешный вход', 'success');
    } catch (error) {
      this.handleAuthError(error, form);
    }
  }

  async handleRegistration(form) {
    try {
      const formData = new FormData(form);
      const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
      };

      this.validateUserData(userData);
      
      const { user, token } = await API.register(userData);
      this.store.commit('SET_USER', user);
      this.store.commit('SET_TOKEN', token);
      
      this.closeModal();
      this.showNotification('Регистрация успешна', 'success');
    } catch (error) {
      this.handleAuthError(error, form);
    }
  }

  validateCredentials({ email, password }) {
    if (!validateEmail(email)) throw new Error('Неверный формат email');
    if (!validatePassword(password)) throw new Error('Пароль должен содержать минимум 6 символов');
  }

  validateUserData({ name, email, password }) {
    if (!name.trim()) throw new Error('Введите имя');
    this.validateCredentials({ email, password });
  }

  async restoreSession() {
    try {
      if (this.store.state.token) {
        const user = await API.checkAuth(this.store.state.token);
        this.store.commit('SET_USER', user);
      }
    } catch (error) {
      this.store.commit('LOGOUT');
    }
  }

  updateUI(user) {
    const authBtn = document.querySelector('[data-auth-trigger]');
    if (!authBtn) return;

    authBtn.innerHTML = user ? `
      <svg><use href="#user-icon"></use></svg>
      <span>${user.name}</span>
    ` : 'Войти';
    
    authBtn.classList.toggle('authenticated', !!user);
  }

  handleAuthError(error, form) {
    console.error('Auth Error:', error);
    this.showNotification(error.message, 'error');
    form.classList.add('error');
    setTimeout(() => form.classList.remove('error'), 2000);
  }

  closeModal() {
    document.getElementById('auth-modal').setAttribute('hidden', 'true');
  }

  showNotification(message, type) {
    const event = new CustomEvent('notify', { 
      detail: { message, type } 
    });
    document.dispatchEvent(event);
  }
}