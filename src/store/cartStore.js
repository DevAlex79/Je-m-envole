// src/store/cartStore.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
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
});
