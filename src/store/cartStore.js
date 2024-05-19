import { defineStore } from "pinia";
import { Lines } from '../models/Lines';
import { Shipment } from '../models/Shipment';

export const useCartStore = defineStore('cart', {
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
});






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
