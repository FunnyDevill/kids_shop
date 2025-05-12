export class ComponentLoader {
    static components = {
      header: '/partials/header.html',
      footer: '/partials/footer.html',
      authModal: '/partials/auth-modal.html',
      cartSidebar: '/partials/cart-sidebar.html'
    };
  
    static async loadAll() {
      try {
        await Promise.all (
          Object.entries(this.components).map(
            ([id, path]) => this.load(id, path)
        );
        return true;
      } catch (error) {
        throw new Error(`Component load failed: ${error.message}`);
      }
    }
  
    static async load(id, path) {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      
      const html = await response.text();
      const target = document.getElementById(id);
      if (!target) throw new Error(`Element #${id} not found`);
      
      target.innerHTML = html;
    }
  }