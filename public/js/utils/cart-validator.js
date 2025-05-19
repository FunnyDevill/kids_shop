/**
 * Валидация данных корзины
 */

/**
 * Проверяет, что передан массив товаров и он не пустой
 * @param {Array} items - массив товаров корзины
 * @returns {boolean}
 */
const validateCartNotEmpty = (items) => {
    return Array.isArray(items) && items.length > 0;
  };
  
  /**
   * Проверяет, что у каждого товара есть корректные `product_id` и `quantity`
   * @param {Array} items - массив товаров корзины
   * @returns {boolean}
   */
  const validateCartItemsStructure = (items) => {
    if (!Array.isArray(items)) return false;
  
    return items.every(item => {
      return (
        item && 
        typeof item.product_id === 'number' && 
        typeof item.quantity === 'number' && 
        item.quantity > 0
      );
    });
  };
  
  /**
   * Проверяет, что товары существуют (запрос к API)
   * @param {Array} items - массив товаров корзины
   * @returns {Promise<boolean>}
   */
  const validateProductsExist = async (items) => {
    try {
      const productIds = items.map(item => item.product_id);
      const response = await fetch('/api/products/check/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_ids: productIds }),
      });
      const data = await response.json();
      return data.valid; // Предполагаем, что API возвращает { valid: boolean }
    } catch (error) {
      console.error('Ошибка проверки товаров:', error);
      return false;
    }
  };
  
  /**
   * Основная функция валидации корзины
   * @param {Array} cartItems - товары в корзине
   * @param {boolean} checkExistence - проверять ли существование товаров через API
   * @returns {Promise<{ isValid: boolean, errors: string[] }>}
   */
  export const validateCart = async (cartItems, checkExistence = false) => {
    const errors = [];
  
    if (!validateCartNotEmpty(cartItems)) {
      errors.push('Корзина пуста');
    }
  
    if (!validateCartItemsStructure(cartItems)) {
      errors.push('Некорректные данные товаров');
    }
  
    if (checkExistence && !(await validateProductsExist(cartItems))) {
      errors.push('Некоторые товары недоступны');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };