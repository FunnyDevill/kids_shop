/**
 * Валидация данных формы
 */

/**
 * Проверяет, является ли email корректным
 * @param {string} email 
 * @returns {boolean} true, если email валиден
 */
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  /**
   * Проверяет, соответствует ли пароль требованиям:
   * - минимум 8 символов
   * - хотя бы 1 цифра
   * - хотя бы 1 буква в верхнем регистре
   * @param {string} password 
   * @returns {boolean} true, если пароль валиден
   */
  export const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  };
  
  /**
   * Проверяет, является ли номер телефона корректным
   * (поддерживает форматы: +79991234567, 89991234567, 9991234567)
   * @param {string} phone 
   * @returns {boolean} true, если номер валиден
   */
  export const validatePhone = (phone) => {
    const re = /^(\+7|8)?\d{10}$/;
    return re.test(phone.replace(/\D/g, ''));
  };
  
  /**
   * Проверяет, не пустое ли поле и соответствует ли минимальной длине
   * @param {string} text 
   * @param {number} minLength 
   * @returns {boolean} true, если текст валиден
   */
  export const validateText = (text, minLength = 2) => {
    return text.trim().length >= minLength;
  };
  
  /**
   * Проверяет, является ли значение числом и в заданном диапазоне
   * @param {string|number} value 
   * @param {number} min 
   * @param {number} max 
   * @returns {boolean} true, если число валидно
   */
  export const validateNumberRange = (value, min, max) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  };
  
  /**
   * Валидация формы заказа (пример)
   * @param {Object} formData - данные формы { name, email, phone, address }
   * @returns {Object} { isValid: boolean, errors: { field: string } }
   */
  export const validateOrderForm = (formData) => {
    const errors = {};
  
    if (!validateText(formData.name)) {
      errors.name = 'Имя должно содержать минимум 2 символа';
    }
  
    if (!validateEmail(formData.email)) {
      errors.email = 'Введите корректный email';
    }
  
    if (!validatePhone(formData.phone)) {
      errors.phone = 'Введите корректный номер телефона';
    }
  
    if (!validateText(formData.address, 5)) {
      errors.address = 'Адрес должен содержать минимум 5 символов';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };