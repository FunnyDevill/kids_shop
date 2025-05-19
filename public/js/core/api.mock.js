// api.mock.js

// Моковые данные для товаров
const mockProducts = [
    {
      id: 1,
      name: "Детская футболка",
      price: 599,
      category: "Одежда",
      image: "/images/products/shirt.jpg",
      stock: 10,
    },
    {
      id: 2,
      name: "Плюшевый мишка",
      price: 1299,
      category: "Игрушки",
      image: "/images/products/teddy.jpg",
      stock: 5,
    },
    {
      id: 3,
      name: "Детские кроссовки",
      price: 1999,
      category: "Обувь",
      image: "/images/products/shoes.jpg",
      stock: 8,
    },
  ];
  
  // Моковые данные для корзины
  let mockCart = [
    {
      productId: 1,
      quantity: 2,
    },
  ];
  
  // Имитация API для получения товаров
  export const getProducts = async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProducts), 500); // Имитация задержки сети
    });
  };
  
  // Имитация API для добавления в корзину
  export const addToCart = async (productId, quantity) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingItem = mockCart.find((item) => item.productId === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          mockCart.push({ productId, quantity });
        }
        resolve({ success: true, cart: mockCart });
      }, 300);
    });
  };
  
  // Имитация API для получения корзины
  export const getCart = async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCart), 200);
    });
  };
  
  // Имитация API для оформления заказа
  export const checkout = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockCart = []; // Очистка корзины после заказа
        resolve({ success: true, orderId: "ORD-" + Date.now() });
      }, 500);
    });
  };