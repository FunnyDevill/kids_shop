/**
 * Компоненты приложения Midnight Dream
 * Отвечает за загрузку и инициализацию всех HTML-компонентов
 */

class ComponentLoader {
   constructor() {
     this.components = {
       header: 'partials/header.html',
       footer: 'partials/footer.html',
       authModal: 'partials/auth-modal.html',
       cartSidebar: 'partials/cart-sidebar.html'
     };
     this.initialized = false;
   }
 
   /**
    * Инициализация всех компонентов
    */
   async init() {
     if (this.initialized) return;
     
     try {
       // Параллельная загрузка всех компонентов
       await Promise.all(
         Object.entries(this.components).map(
           ([id, path]) => this.loadComponent(id, path)
         )
       );
       
       this.initHeader();
       this.initAuthModal();
       this.initCartSidebar();
       
       this.initialized = true;
       console.log('Все компоненты загружены и инициализированы');
     } catch (error) {
       console.error('Ошибка инициализации компонентов:', error);
       throw error;
     }
   }
 
   /**
    * Загрузка отдельного компонента
    * @param {string} id - ID элемента в DOM
    * @param {string} path - Путь к HTML-файлу
    */
   async loadComponent(id, path) {
     try {
       const response = await fetch(path);
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
       const html = await response.text();
       document.getElementById(id).innerHTML = html;
     } catch (error) {
       console.error(`Ошибка загрузки компонента ${id}:`, error);
       throw error;
     }
   }
 
   /**
    * Инициализация шапки сайта
    */
   initHeader() {
     const header = document.getElementById('header');
     if (!header) return;
 
     // Обработчик для мобильного меню
     const mobileMenuToggle = header.querySelector('.mobile-menu-toggle');
     if (mobileMenuToggle) {
       mobileMenuToggle.addEventListener('click', () => {
         header.classList.toggle('mobile-menu-open');
       });
     }
 
     // Инициализация поиска
     const searchForm = header.querySelector('.search-form');
     if (searchForm) {
       searchForm.addEventListener('submit', (e) => {
         e.preventDefault();
         const query = searchForm.querySelector('input').value.trim();
         if (query) {
           console.log('Поиск:', query);
           // Здесь можно добавить логику поиска
         }
       });
     }
   }
 
   /**
    * Инициализация модального окна авторизации
    */
   initAuthModal() {
     const authModal = document.getElementById('auth-modal');
     if (!authModal) return;
 
     // Переключение между вкладками
     authModal.querySelectorAll('.auth-tab').forEach(tab => {
       tab.addEventListener('click', (e) => {
         e.preventDefault();
         const tabName = tab.dataset.tab;
         this.switchAuthTab(tabName);
       });
     });
 
     // Обработчик для закрытия
     const closeBtn = authModal.querySelector('.close-auth');
     if (closeBtn) {
       closeBtn.addEventListener('click', () => {
         authModal.classList.remove('active');
         document.querySelector('.overlay').classList.remove('active');
       });
     }
   }
 
   /**
    * Переключение вкладок авторизации
    * @param {string} tabName - Имя вкладки (login/register)
    */
   switchAuthTab(tabName) {
     const authModal = document.getElementById('auth-modal');
     if (!authModal) return;
 
     // Обновление активных вкладок
     authModal.querySelectorAll('.auth-tab').forEach(tab => {
       tab.classList.toggle('active', tab.dataset.tab === tabName);
     });
 
     // Обновление активных форм
     authModal.querySelectorAll('.auth-form').forEach(form => {
       form.classList.toggle('active', form.dataset.form === tabName);
     });
   }
 
   /**
    * Инициализация боковой панели корзины
    */
   initCartSidebar() {
     const cartSidebar = document.getElementById('cart-sidebar');
     if (!cartSidebar) return;
 
     // Обработчик закрытия
     const closeBtn = cartSidebar.querySelector('.close-cart');
     if (closeBtn) {
       closeBtn.addEventListener('click', () => {
         cartSidebar.classList.remove('open');
         document.querySelector('.overlay').classList.remove('active');
       });
     }
   }
 }
 
 // Создаем и экспортируем экземпляр загрузчика
 const componentLoader = new ComponentLoader();
 
 // Инициализация при загрузке DOM
 document.addEventListener('DOMContentLoaded', () => {
   componentLoader.init().catch(error => {
     console.error('Ошибка при инициализации компонентов:', error);
   });
 });
 
 // Экспорт для возможного использования в других модулях
 window.ComponentLoader = ComponentLoader;