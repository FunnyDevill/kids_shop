class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.render();
        this.updateCounter();
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        this.save();
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.render();
        this.updateCounter();
    }

    render() {
        const container = document.querySelector('.cart-items');
        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image" style="background-image: url('${item.image}')"></div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">${item.price} ₽</div>
                    <div class="item-controls">
                        <button class="btn-quantity minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn-quantity plus">+</button>
                    </div>
                </div>
                <button class="remove-btn">×</button>
            </div>
        `).join('');
        
        this.updateTotal();
    }
}