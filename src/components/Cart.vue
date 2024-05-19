<!-- src/components/Cart.vue -->
<template>
    <main id="cart">
        <h1>Mon Panier</h1>
        <div v-if="cartItems.length">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <img :src="item.image" :alt="item.title" />
                <div>
                    <h2>{{ item.title }}</h2>
                    <p>{{ item.price }} €</p>
                    <p>Quantité : {{ item.quantity }}</p>
                    <button @click="removeItem(item.id)">Retirer</button>
                </div>
            </div>
            <div class="cart-summary">
                <p>Total : {{ totalPrice }} €</p>
                <button @click="clearCart">Vider le panier</button>
            </div>
        </div>
        <div v-else>
            <p>Votre panier est vide.</p>
        </div>
    </main>
</template>

<script>
import { useCartStore } from '@/store/cartStore';

export default {
    setup() {
        const cartStore = useCartStore();
        return {
            cartItems: cartStore.items,
            totalPrice: cartStore.totalPrice,
            removeItem: cartStore.removeItem,
            clearCart: cartStore.clearCart,
        };
    },
};
</script>

<style scoped>
#cart {
    padding: 20px;
}

.cart-item {
    display: flex;
    margin-bottom: 20px;
}

.cart-item img {
    width: 100px;
    height: auto;
    margin-right: 20px;
}

.cart-summary {
    margin-top: 20px;
    font-size: 20px;
}
</style>