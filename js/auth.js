class AuthSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('user')) || null;
        this.init();
    }

    init() {
        this.renderAuthState();
        this.setupListeners();
    }

    async handleLogin(email, password) {
        try {
            // Эмуляция запроса к серверу
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (!email || !password) {
                throw new Error('Заполните все поля');
            }

            this.currentUser = {
                email,
                name: email.split('@')[0],
                token: 'fake-jwt-token'
            };
            
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            this.renderAuthState();
            this.closeModal();
            
            App.showNotification('Вход выполнен успешно', 'success');
            return true;
        } catch (error) {
            App.showNotification(error.message, 'error');
            return false;
        }
    }

    async handleRegister(name, email, password) {
        try {
            // Валидация
            if (!name || !email || !password) {
                throw new Error('Заполните все поля');
            }
            if (password.length < 6) {
                throw new Error('Пароль должен быть не менее 6 символов');
            }

            // Эмуляция запроса
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.currentUser = {
                name,
                email,
                token: 'fake-jwt-token'
            };
            
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            this.renderAuthState();
            this.closeModal();
            
            App.showNotification('Регистрация успешна', 'success');
            return true;
        } catch (error) {
            App.showNotification(error.message, 'error');
            return false;
        }
    }

    setupListeners() {
        // Обработка формы входа
        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.elements.email.value;
            const password = e.target.elements.password.value;
            await this.handleLogin(email, password);
        });

        // Обработка формы регистрации
        document.getElementById('register-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = e.target.elements.name.value;
            const email = e.target.elements.email.value;
            const password = e.target.elements.password.value;
            await this.handleRegister(name, email, password);
        });

        // Кнопка выхода
        document.querySelector('.logout-btn')?.addEventListener('click', () => {
            localStorage.removeItem('user');
            this.currentUser = null;
            this.renderAuthState();
            App.showNotification('Вы вышли из системы', 'success');
        });
    }
}

const auth = new AuthSystem();