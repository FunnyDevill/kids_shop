/**
 * Утилиты для работы с маршрутами (URL)
 */

// Базовый URL API (если используется Django REST Framework или AJAX)
const API_BASE_URL = '/api/';

// Основные пути фронтенда (если используется History API для SPA)
const FRONTEND_ROUTES = {
  HOME: '/',
  PRODUCTS: '/products/',
  PRODUCT_DETAIL: '/products/:id/',
  CART: '/cart/',
  CHECKOUT: '/checkout/',
  LOGIN: '/login/',
  REGISTER: '/register/',
  PROFILE: '/profile/',
};

// Пути для API (для AJAX-запросов)
const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}products/`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}products/${id}/`,
  ADD_TO_CART: `${API_BASE_URL}cart/add/`,
  REMOVE_FROM_CART: (id) => `${API_BASE_URL}cart/remove/${id}/`,
  CHECKOUT: `${API_BASE_URL}checkout/`,
  LOGIN: `${API_BASE_URL}auth/login/`,
  REGISTER: `${API_BASE_URL}auth/register/`,
};

/**
 * Генерация URL для продукта (пример: /products/123/)
 * @param {string} route - ключ из FRONTEND_ROUTES (например, 'PRODUCT_DETAIL')
 * @param {Object} params - параметры для подстановки (например, { id: 123 })
 * @returns {string} готовый URL
 */
const generateFrontendUrl = (route, params = {}) => {
  let url = FRONTEND_ROUTES[route];
  if (!url) return '/';

  // Заменяем :param на значения из params
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });

  return url;
};

/**
 * Проверяет, является ли текущий URL активным (для подсветки меню)
 * @param {string} path - путь для проверки (например, '/products/')
 * @returns {boolean}
 */
const isActiveRoute = (path) => {
  return window.location.pathname === path;
};

// Экспорт
export {
  FRONTEND_ROUTES,
  API_ENDPOINTS,
  generateFrontendUrl,
  isActiveRoute,
};