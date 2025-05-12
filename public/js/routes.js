export const routes = [
    {
      path: '/',
      component: 'HomeView',
      meta: {
        title: 'Главная',
        description: 'Магазин готической детской одежды'
      }
    },
    {
      path: '/product/:id',
      component: 'ProductView',
      meta: {
        title: 'Страница товара'
      }
    },
    {
      path: '/cart',
      component: 'CartView'
    }
  ];