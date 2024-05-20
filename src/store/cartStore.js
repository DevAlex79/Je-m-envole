import { defineStore } from "pinia";
import { Lines } from '../models/Lines';
import { Shipment } from '../models/Shipment';

export const useCartStore = defineStore('cart', {
    state: () => ({
        lines: new Lines(),
        shipment: new Shipment()
    }),
    actions: {
        // Ajouter un produit au panier
        addProductToCart(product) {
            product.quantity = product.quantity || 1;
            product.total = product.total || (product.unitPrice ? product.quantity * product.unitPrice : 0);
            this.lines.addLine(product);
            this.saveCartToLocalStorage();
        },
        // Retirer un produit du panier
        removeProductFromCart(product) {
            // Retirer le produit de la liste des lignes du panier
            this.lines.removeLine(product);
            this.saveCartToLocalStorage();
        },
        // Mettre à jour le type de livraison
        updateShipmentType(type) {
            // Mettre à jour le type de livraison dans l'état du store
            this.shipment.setShipmentType(type);
            this.saveCartToLocalStorage();
        },
        saveCartToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.lines.lines));
            localStorage.setItem('shipment', JSON.stringify(this.shipment));
        },
        loadCartFromLocalStorage() {
            const cart = localStorage.getItem('cart');
            const shipment = localStorage.getItem('shipment');
            if (cart) {
                const parsedCart = JSON.parse(cart);
                parsedCart.forEach(item => this.lines.addLine(item));
            }
            if (shipment) {
                Object.assign(this.shipment, JSON.parse(shipment));
            }
        }
    },
    getters: {
        // Calculer le nombre total d'articles dans le panier
        totalArticles: (state) => state.lines.calculateTotalArticles(),
        // Calculer le prix total des articles dans le panier
        totalArticlesPrice: (state) => state.lines.calculateTotalArticlesPrice(),
        // Obtenir le prix de livraison
        shipmentPrice: (state) => state.shipment.price,
        // Calculer le prix total (articles + livraison) dans le panier
        totalPrice: (state) => state.lines.calculateTotalArticlesPrice() + state.shipment.price
    }
});





/*import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const lines = ref([]);
    const shipmentType = ref('relais'); // Par défaut à 'relais'

    const shipmentPrices = {
        relais: 5,
        domicile: 12,
    };

    const totalArticles = computed(() => {
        return lines.value.reduce((sum, line) => sum + line.quantity, 0);
    });

    const totalArticlesPrice = computed(() => {
        return lines.value.reduce((sum, line) => sum + line.price * line.quantity, 0);
    });

    const shipmentPrice = computed(() => {
        return shipmentPrices[shipmentType.value] || 0;
    });

    const totalPrice = computed(() => {
        return (parseFloat(totalArticlesPrice.value) + parseFloat(shipmentPrice.value)).toFixed(2);
    });

    function addProductToCart(product) {
        lines.value.push(product);
    }

    function removeProductFromCart(product) {
        const index = lines.value.findIndex((line) => line.id === product.id);
        if (index !== -1) {
            lines.value.splice(index, 1);
        }
    }

    function updateShipmentType(type) {
        if (shipmentPrices[type] !== undefined) {
            shipmentType.value = type;
        }
    }

    return {
        lines,
        shipmentType,
        totalArticles,
        totalArticlesPrice,
        shipmentPrice,
        totalPrice,
        addProductToCart,
        removeProductFromCart,
        updateShipmentType,
    };
});*/





/*import { defineStore } from "pinia";
//import { Lines } from '../models/Lines';
//import { Shipment } from '../models/Shipment';
import { ref, computed } from "vue";

export const useCartStore = defineStore('cart', () => {
    const lines = ref([]);
    const shipmentType = ref('relais'); // Relais colis par défaut

    function addProductToCart(article) {
        const existingLine = lines.value.find(line => line.id === article.id);
        if (existingLine) {
            existingLine.quantity++;
        } else {
            lines.value.push({ ...article, quantity: 1 });
        }
    }
    function removeProductFromCart(article) {
        const index = lines.value.findIndex(line => line.id === article.id);
        if (index !== -1) {
            lines.value.splice(index, 1);
        }
    }
    function updateShipmentType(type) {
        shipmentType.value = type;
        //calculateShipmentPrice();
    }

   // function calculateShipmentPrice() {
    //    shipmentPrice.value = shipmentType.value === 'relais' ? 5 : 12;
    //}

    const totalArticles = computed(() => lines.value.reduce((sum, line) => sum + line.quantity, 0));
    const totalArticlesPrice = computed(() => lines.value.reduce((sum, line) => sum + line.price * line.quantity, 0));
    const shipmentPrice = computed(() => shipmentType.value === 'relais' ? 5 : 12);
    const totalPrice = computed(() => totalArticlesPrice.value + shipmentPrice.value);

    return {
        lines,
        addProductToCart,
        removeProductFromCart,
        updateShipmentType,
        totalArticles,
        totalArticlesPrice,
        shipmentPrice,
        totalPrice
    };
});*/


/*export const useCartStore = defineStore('cart', {
    state: () => ({
        lines: new Lines(),
        shipment: new Shipment()
    }),
    actions: {
        addProductToCart(product) {
            const existingLine = this.lines.lines.find(line => line.name === product.name);
            if (existingLine) {
                existingLine.updateQuantity(existingLine.quantity + 1);
            } else {
                this.lines.addLine(product);
            }
        },
        removeProductFromCart(product) {
            this.lines.removeLine(product);
        },
        updateShipmentType(type) {
            this.shipment.setShipmentType(type);
        }
    },
    getters: {
        totalArticles: (state) => state.lines.calculateTotalArticles(),
        totalArticlesPrice: (state) => state.lines.calculateTotalArticlesPrice(),
        shipmentPrice: (state) => state.shipment.price,
        totalPrice: (state) => state.lines.calculateTotalArticlesPrice() + state.shipment.price
    }
});*/






/*export const useCartStore = defineStore("cart", {
    state: () => ({
        items: [],
    }),
    getters: {
        itemCount: (state) => state.items.length,
        totalPrice: (state) =>
            state.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    },
    actions: {
        addItem(product) {
            const existingItem = this.items.find((item) => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
        },
        removeItem(productId) {
            this.items = this.items.filter((item) => item.id !== productId);
        },
        clearCart() {
            this.items = [];
        },
    },
});*/
