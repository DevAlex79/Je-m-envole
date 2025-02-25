<template>
    <div class="checkout-container">
        <h1>Résumé de votre commande</h1>

        <!-- Affichage du panier -->
        <p v-if="cart.lines.length === 0">Votre panier est vide.</p>

        <!-- <table v-else>
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Prix total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cart.lines.lines" :key="item.id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.unitPrice ? item.unitPrice.toFixed(2) : '0.00' }}€</td>
                    <td>{{ item.unitPrice && item.quantity ? (item.unitPrice * item.quantity).toFixed(2) : '0.00' }}€</td>
                </tr>
            </tbody>
        </table> -->
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Prix total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cart.lines.lines" :key="item.id">
                    <td><strong>{{ item.title }}</strong></td>
                    <td><strong>{{ item.quantity }}</strong></td>
                    <td><strong>{{ item.unitPrice ? item.unitPrice.toFixed(2) : '0.00' }}€</strong></td>
                    <td><strong>{{ item.unitPrice && item.quantity ? (item.unitPrice * item.quantity).toFixed(2) : '0.00' }}€</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- Tableau du total et mode de livraison -->
        <table class="checkout-summary">
            <thead>
                <tr>
                    <th colspan="2">Total à Payer</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Sous-total des articles :</strong></td>
                    <td><strong>{{ cart.totalArticlesPrice.toFixed(2) }}€</strong></td>
                </tr>
                <tr>
                    <td><strong>Mode de livraison :</strong></td>
                    <td><strong>{{ shipment.type === 'domicile' ? 'À Domicile' : 'Relais Colis' }}</strong></td>
                </tr>
                <tr>
                    <td><strong>Frais de livraison :</strong></td>
                    <td><strong>{{ shipment.price.toFixed(2) }}€</strong></td>
                </tr>
                <tr class="total-row">
                    <td><strong>Total à payer :</strong></td>
                    <td><strong>{{ totalPrice.toFixed(2) }}€</strong></td>
                </tr>
            </tbody>
        </table>



        <!-- Mode de livraison -->
        <!-- <div v-if="cart.lines.length > 0" class="shipment-container">
            <h2>Mode de livraison</h2>
            <p>Type: <strong>{{ shipment.type || 'Non spécifié' }}</strong></p>
            <p>Frais de livraison: <strong>{{ shipment.price ? shipment.price.toFixed(2) : '0.00' }}€</strong></p>
        </div> -->

        <!-- Total de la commande -->
        <!-- <div v-if="cart.lines.length > 0" class="total-container">
            <h2>Total à payer</h2>
            <p><strong>{{ totalPrice.toFixed(2) }}€</strong></p>
        </div> -->

        <!-- Bouton de validation de la commande -->
        <button v-if="cart.lines.lines.length > 0" @click="confirmOrder" class="confirm-order-button">
            Valider ma commande
        </button>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';

export default {
    setup() {
        const router = useRouter();
        const cart = useCartStore();
        const shipment = ref({ type: '', price: 0 });

        // 🔹 Total qui prend en compte la livraison
        const totalPrice = computed(() => {
            return (cart.totalArticlesPrice || 0) + (shipment.value.price || 0);
        });

        // Chargement des informations du panier et du mode de livraison
        function loadCart() {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    alert("Vous devez être connecté pour accéder au panier.");
                    router.push({ name: 'Login' });
                    return;
                }

                cart.loadCartFromLocalStorage();

                // Charger les informations du mode de livraison depuis localStorage
                const savedShipment = JSON.parse(localStorage.getItem('shipment'));
                if (savedShipment) {
                    shipment.value = savedShipment;
                }

                console.log("Panier chargé :", cart.lines);
                console.log("Mode de livraison chargé :", shipment.value);
            } catch (error) {
                alert("Erreur lors du chargement du panier.");
                console.error(error);
            }
        }

        // Validation de la commande
        async function confirmOrder() {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Vous devez être connecté pour valider votre commande.");
                router.push({ name: 'Login' });
                return;
            }

            try {
                console.log("Token récupéré :", token);

                // Récupérer l'utilisateur connecté
                const userResponse = await fetch('http://127.0.0.1:8000/api/user-profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!userResponse.ok) {
                    throw new Error("Erreur lors de la récupération de l'utilisateur.");
                }

                const userData = await userResponse.json();
                console.log("Réponse API /user :", userData);

                // Vérifier l'ID utilisateur
                const userId = userData.id_user;
                if (!userId) {
                    throw new Error("ID utilisateur manquant dans la réponse");
                }
                console.log("Utilisateur ID :", userId);

                // Envoi de la commande
                const orderResponse = await fetch('http://127.0.0.1:8000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_user: userId,  
                        cart: cart.lines.lines, 
                        total_price: totalPrice.value, // 🔹 Utilisation du prix total avec la livraison
                        status: "en attente",
                        shipmentType: shipment.value.type || "Standard",
                        shipmentPrice: shipment.value.price || 0
                    })
                });

                if (!orderResponse.ok) {
                    const errorData = await orderResponse.json();
                    throw new Error(errorData.message || "Erreur lors de la validation de la commande.");
                }

                alert('Commande confirmée 🎉');
                cart.clearCart();
                localStorage.removeItem('cart');
                localStorage.removeItem('shipment'); // 🔹 Nettoyage des infos de livraison après validation

                // Rediriger vers le Dashboard utilisateur après la commande
                router.push({ name: 'UserDashboard' });

            } catch (error) {
                console.error("Erreur API :", error);
                alert(error.message);
            }
        }

        //onMounted(loadCart);
        onMounted(() => {
            cart.loadCartFromLocalStorage();
            
            // Charger le mode de livraison depuis localStorage
            const savedShipment = JSON.parse(localStorage.getItem('shipment'));
            if (savedShipment) {
                shipment.value = savedShipment;  // 🔹 Met à jour shipment avec les données enregistrées
            }

            console.log("Panier chargé :", cart.lines);
            console.log("Mode de livraison chargé :", shipment.value);
        });

        return { cart, shipment, totalPrice, confirmOrder, loadCart };
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
    background-color: #F0F1FF;
}

.total-container, .shipment-container {
    margin-top: 20px;
    font-size: 18px;
}

.confirm-order-button {
    background-color: #6066FA; 
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    margin-top: 20px;
}

.confirm-order-button:hover {
    background-color: #F0F1FF;
    color: #6066FA;
    border: #6066FA 1px solid;
}

.checkout-summary {
    width: 50%;
    margin: 20px auto;
    border-collapse: collapse;
    border: 2px solid #6066FA;
}

.checkout-summary th {
    background-color: #6066FA;
    color: white;
    padding: 10px;
    text-align: center;
}

.checkout-summary td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
}

.total-row {
    background-color: #f2f2f2;
    font-weight: bold;
}

</style>