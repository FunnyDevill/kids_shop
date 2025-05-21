/**
 * Валидатор корзины и товаров
 */
export function validateCart(cart) {
  if (!cart) {
    throw new Error('Корзина пуста');
  }

  if (!Array.isArray(cart)) {
    throw new Error('Корзина должна быть массивом товаров');
  }

  // Проверка каждого товара в корзине
  cart.forEach(item => validateProduct(item));
}

export function validateProduct(product) {
  if (!product) {
    throw new Error('Товар не определен');
  }

  const requiredFields = ['id', 'name', 'price', 'quantity'];
  const missingFields = requiredFields.filter(field => !(field in product));

  if (missingFields.length > 0) {
    throw new Error(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`);
  }

  if (typeof product.price !== 'number' || product.price <= 0) {
    throw new Error('Некорректная цена товара');
  }

  if (typeof product.quantity !== 'number' || product.quantity <= 0) {
    throw new Error('Некорректное количество товара');
  }
}