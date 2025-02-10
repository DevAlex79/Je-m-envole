<template>
    <div class="checkout-container">
        <h1>Validation de votre commande</h1>

        <table class="checkout-table">
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Prix total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="line in cart.lines.lines" :key="line.id">
                    <td>{{ line.title }}</td>
                    <td>{{ line.quantity }}</td>
                    <td>{{ line.unitPrice ? line.unitPrice.toFixed(2) : '0.00' }}€</td>
                    <td>{{ line.total ? line.total.toFixed(2) : '0.00' }}€</td>
                </tr>
            </tbody>
        </table>

        <div class="checkout-summary">
            <p><strong>Total articles :</strong> {{ totalArticlesPrice.toFixed(2) }} €</p>
            <p><strong>Frais de livraison :</strong> {{ shipmentPrice.toFixed(2) }} €</p>
            <p><strong>Total général :</strong> {{ totalPrice.toFixed(2) }} €</p>
        </div>

        <div class="checkout-shipment">
            <h3>Mode de livraison choisi :</h3>
            <p>{{ cart.shipment.type === 'relais' ? 'Relais Colis (5€)' : 'À Domicile (12€)' }}</p>
        </div>

        <button class="confirm-order-button" @click="confirmOrder">Confirmer ma commande</button>
    </div>
</template>

<script>
import { useCartStore } from '@/store/cartStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Checkout',
    setup() {
        const cart = useCartStore();
        const router = useRouter();

        function confirmOrder() {
            alert('Commande confirmée ! 🎉');
            cart.clearCart(); // Vider le panier après la validation
            router.push({ name: 'Articles' }); // Rediriger vers la page Articles
        }

        return {
            cart,
            totalArticlesPrice: computed(() => cart.totalArticlesPrice),
            shipmentPrice: computed(() => cart.shipmentPrice),
            totalPrice: computed(() => cart.totalPrice),
            confirmOrder
        };
    }
};
</script>

<style scoped>
.checkout-container {
    width: 70%;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    font-family: Poppins;
}

.checkout-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.checkout-table th, .checkout-table td {
    border: 1px solid #000;
    padding: 10px;
    text-align: left;
}

.checkout-table th {
    background-color: #f2f2f2;
}

.checkout-summary {
    margin-top: 20px;
    font-size: 18px;
}

.checkout-shipment {
    margin-top: 20px;
    font-size: 16px;
}

.confirm-order-button {
    background-color: #28a745;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
}

.confirm-order-button:hover {
    background-color: #218838;
}
</style>
