<template>
    <div class="checkout-container">
        <h1>Résumé de votre commande</h1>

        <!-- Si le panier est vide -->
        <p v-if="!cart || cart.length === 0">Votre panier est vide.</p>

        <!-- Si le panier contient des articles -->
        <table v-else>
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Prix total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cart" :key="item.id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.unitPrice.toFixed(2) }}€</td>
                    <td>{{ (item.unitPrice * item.quantity).toFixed(2) }}€</td>
                </tr>
            </tbody>
        </table>

        <!-- Mode de livraison -->
        <div v-if="cart && cart.length > 0" class="shipment-container">
            <h2>Mode de livraison</h2>
            <p>Type: <strong>{{ shipmentType }}</strong></p>
            <p>Prix de livraison: <strong>{{ shipmentPrice.toFixed(2) }}€</strong></p>
        </div>

        <!-- Total de la commande -->
        <div v-if="cart && cart.length > 0" class="total-container">
            <h2>Total à payer</h2>
            <p><strong>{{ totalPrice.toFixed(2) }}€</strong></p>
        </div>

        <!-- Bouton de validation -->
        <button v-if="cart && cart.length > 0" @click="confirmOrder" class="confirm-button">
            Confirmer ma commande
        </button>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const cart = ref(null);
        const totalPrice = ref(0);
        const shipmentPrice = ref(0);
        const shipmentType = ref('');

        // 🔹 Charger le panier sécurisé
        async function loadCart() {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Vous devez être connecté pour accéder au panier.");
                router.push({ name: 'Login' });
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/cart', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error("Impossible de charger le panier.");

                const data = await response.json();
                cart.value = data.cart;
                totalPrice.value = data.totalPrice;
                shipmentPrice.value = data.shipmentPrice;
                shipmentType.value = data.shipmentType;

            } catch (error) {
                alert(error.message);
                router.push({ name: 'Articles' });
            }
        }

        // 🔹 Validation de la commande
        async function confirmOrder() {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Vous devez être connecté pour valider votre commande.");
                router.push({ name: 'Login' });
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/checkout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cart: cart.value,
                        totalPrice: totalPrice.value
                    })
                });

                if (!response.ok) throw new Error("Erreur lors de la validation de la commande.");

                alert('Commande confirmée 🎉');
                localStorage.removeItem('cart'); // Nettoyer le panier
                router.push({ name: 'Articles' }); // Rediriger

            } catch (error) {
                alert(error.message);
            }
        }

        onMounted(loadCart); // Charger les infos du panier au montage

        return { cart, totalPrice, shipmentPrice, shipmentType, confirmOrder };
    }
};
</script>

<style scoped>
.checkout-container {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    padding: 20px;
}

h1, h2 {
    color: #333;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.total-container, .shipment-container {
    margin-top: 20px;
    font-size: 18px;
}

.confirm-button {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    margin-top: 20px;
}

.confirm-button:hover {
    background-color: #218838;
}
</style>
