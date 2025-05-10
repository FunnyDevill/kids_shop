/**
 * Midnight Dream - Главный файл приложения
 * Инициализирует все компоненты и управляет состоянием
 */

// Основной объект приложения
const App = {
   // Инициализация приложения
   init() {
     this.loadComponents();
     this.setupEventListeners();
     this.checkAuthState();
     console.log('Приложение инициализировано');
   },
 
   // Загрузка HTML-компонентов
   async loadComponents() {
     try {
       await Promise.all([
         this.loadComponent('header', 'partials/header.html'),
         this.loadComponent('footer', 'partials/footer.html'),
         this.loadComponent('auth-modal', 'partials/auth-modal.html'),
         this.loadComponent('cart-sidebar', 'partials/cart-sidebar.html')
       ]);
       
       // Инициализация модулей после загрузки компонентов
       this.initModules();
     } catch (error) {
       console.error('Ошибка загрузки компонентов:', error);
     }
   },
 
   // Загрузка отдельного компонента
   async loadComponent(id, path) {
     const response = await fetch(path);
     if (!response.ok) throw new Error(`Не удалось загрузить ${path}`);
     
     const html = await response.text();
     document.getElementById(id).innerHTML = html;
   },
 
   // Инициализация модулей
   initModules() {
     // Инициализация корзины (экземпляр доступен через window.cart)
     window.cart = new Cart();
     
     // Инициализация авторизации (экземпляр доступен через window.auth)
     window.auth = new AuthSystem();
     
     // Инициализация продуктов
     this.initProducts();
   },
 
   // Проверка состояния авторизации
   checkAuthState() {
     const user = JSON.parse(localStorage.getItem('user'));
     if (user) {
       console.log('Пользователь авторизован:', user.email);
       this.updateAuthUI(user);
     }
   },
 
   // Обновление UI для авторизованного пользователя
   updateAuthUI(user) {
     const authBtn = document.querySelector('.auth-btn');
     if (authBtn) {
       authBtn.innerHTML = `
         <svg width="20" height="20" fill="currentColor">
           <use href="#user-icon"></use>
         </svg>
         <span>${user.name}</span>
       `;
       authBtn.classList.add('authenticated');
     }
   },
 
   // Установка обработчиков событий
   setupEventListeners() {
     // Глобальные обработчики
     document.addEventListener('click', this.handleGlobalClicks.bind(this));
     
     // Обработчик для оверлея
     document.querySelector('.overlay')?.addEventListener('click', () => {
       this.closeAllModals();
     });
     
     // Обработчик ESC для закрытия модалок
     document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') this.closeAllModals();
     });
   },
 
   // Обработка глобальных кликов
   handleGlobalClicks(e) {
     // Открытие корзины
     if (e.target.closest('.cart-btn')) {
       e.preventDefault();
       this.toggleCart();
     }
     
     // Открытие авторизации
     if (e.target.closest('.auth-btn')) {
       e.preventDefault();
       const isAuthenticated = document.querySelector('.auth-btn').classList.contains('authenticated');
       if (isAuthenticated) {
         this.logout();
       } else {
         this.toggleAuthModal();
       }
     }
     
     // Закрытие модалок по клику на крестик
     if (e.target.classList.contains('close-modal')) {
       this.closeAllModals();
     }
   },
 
   // Управление корзиной
   toggleCart() {
     document.getElementById('cart-sidebar').classList.toggle('open');
     document.querySelector('.overlay').classList.toggle('active');
     document.body.classList.toggle('no-scroll');
   },
 
   // Управление модальным окном авторизации
   toggleAuthModal() {
     document.getElementById('auth-modal').classList.toggle('active');
     document.querySelector('.overlay').classList.toggle('active');
     document.body.classList.toggle('no-scroll');
   },
 
   // Закрытие всех модальных окон
   closeAllModals() {
     document.getElementById('cart-sidebar').classList.remove('open');
     document.getElementById('auth-modal').classList.remove('active');
     document.querySelector('.overlay').classList.remove('active');
     document.body.classList.remove('no-scroll');
   },
 
   // Выход из системы
   logout() {
     localStorage.removeItem('user');
     document.querySelector('.auth-btn').classList.remove('authenticated');
     document.querySelector('.auth-btn').innerHTML = `
       <svg width="20" height="20" fill="currentColor">
         <use href="#user-icon"></use>
       </svg>
       <span>Войти</span>
     `;
     this.showNotification('Вы вышли из системы', 'success');
   },
 
   // Инициализация продуктов
   initProducts() {
     // Можно добавить загрузку продуктов с сервера
     window.products = products; // Из products.js
     this.renderProducts();
   },
 
   // Рендер продуктов
   renderProducts() {
     const grid = document.querySelector('.products-grid');
     if (!grid) return;
     
     grid.innerHTML = products.map(product => `
       <div class="product-card" data-id="${product.id}">
         <div class="product-image" style="background-image: url('${product.image}')"></div>
         <div class="product-info">
           <h3>${product.name}</h3>
           <p>${product.description}</p>
           <div class="product-price">${product.price.toLocaleString()} ₽</div>
           <button class="btn add-to-cart">В корзину</button>
         </div>
       </div>
     `).join('');
   },
 
   // Показать уведомление
   showNotification(message, type = 'success') {
     const notification = document.createElement('div');
     notification.className = `notification ${type}`;
     notification.innerHTML = `
       <svg width="20" height="20" fill="currentColor">
         <use href="#${type === 'success' ? 'check' : 'error'}-icon"></use>
       </svg>
       <span>${message}</span>
     `;
     
     document.body.appendChild(notification);
     
     setTimeout(() => {
       notification.classList.add('show');
     }, 10);
     
     setTimeout(() => {
       notification.classList.remove('show');
       setTimeout(() => notification.remove(), 300);
     }, 3000);
   }
 };
 
 // Запуск приложения после полной загрузки DOM
 document.addEventListener('DOMContentLoaded', () => App.init());
 
 // Экспорт для использования в других модулях
 window.App = App;