export class ComponentLoader {
  static components = {
    header: '/partials/header.html',
    footer: '/partials/footer.html',
    authModal: '/partials/auth-modal.html',
    cartSidebar: '/partials/cart-sidebar.html'
  };

  static loadedComponents = new Set();

  static async loadAll() {
    try {
      await Promise.all(
        Object.entries(this.components).map(
          ([id, path]) => this.load(id, path)
        )
      );
      return true;
    } catch (error) {
      console.error(`Component load failed: ${error.message}`);
      throw error; // Перебрасываем ошибку для обработки выше
    }
  }

  static async load(id, path) {
    if (this.loadedComponents.has(id)) {
      console.warn(`Component ${id} already loaded`);
      return;
    }

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error(`Invalid content type for ${path}: expected text/html`);
    }

    const html = await response.text();
    if (!html.trim()) {
      throw new Error(`Empty content loaded for ${path}`);
    }

    const target = document.getElementById(id);
    if (!target) {
      throw new Error(`Element #${id} not found`);
    }

    target.innerHTML = html;
    this.loadedComponents.add(id);
  }
}