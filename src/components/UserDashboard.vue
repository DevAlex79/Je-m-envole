<template>
    <div class="dashboard">
        <h1>Tableau de bord de {{ userName }}</h1>
        <p>Bienvenue, {{ userName }} ! Consultez vos commandes et informations personnelles.</p>
        <button @click="logout" class="logout-btn">Se déconnecter</button>

        <h2>Historique de vos commandes</h2>
        <p v-if="orders.length === 0 && !error">Vous n'avez passé aucune commande.</p>

        <div class="table-container" v-if="orders.length > 0">
            <table>
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Date</th>
                        <th>Montant (€)</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id_order">
                        <td>#{{ order.id_order }}</td>
                        <td>{{ formatDate(order.created_at) }}</td>
                        <td>{{ order.total_price ? parseFloat(order.total_price).toFixed(2) : '0.00' }}</td>
                        <td :class="getStatusClass(order.status)">{{ order.status }}</td>
                        <td>
                            <button 
                                v-if="order.status === 'en attente' && isAdmin"
                                @click="cancelOrder(order.id_order)"
                                class="cancel-btn">
                                Annuler
                            </button>
                            <span v-else>Aucune action</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="message" class="success">{{ message }}</p>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const userName = ref('Utilisateur');
        const userId = ref(null);
        const orders = ref([]);
        const message = ref('');
        const error = ref('');
        const userRole = ref(null);

        // Vérifie si l'utilisateur est administrateur
        const isAdmin = computed(() => userRole.value === 3);

        function getUserInfo() {
            try {
                const userString = localStorage.getItem('user');
                if (userString) {
                    const user = JSON.parse(userString);
                    userName.value = user.username || "Utilisateur";
                    userId.value = user.id_user; // Stocker l'ID utilisateur
                    userRole.value = user.Roles_id_role; // Stocker le rôle de l'utilisateur
                }
            } catch (err) {
                console.error("Erreur récupération utilisateur :", err);
            }
        }

        async function fetchOrders() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    error.value = "Veuillez vous reconnecter.";
                    router.push('/login');
                    return;
                }

                // Vérification de l'ID utilisateur
                if (!userId.value) {
                    throw new Error("ID utilisateur manquant");
                }

                // Modifier l'URL pour utiliser la nouvelle route
                const response = await fetch(`http://127.0.0.1:8000/api/orders/user/${userId.value}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Vérification si la réponse contient une erreur 404
                if (response.status === 404) {
                    orders.value = []; // Aucune commande trouvée
                    error.value = ''; // Ne pas afficher d'erreur
                    return;
                }

                if (!response.ok) throw new Error("Erreur lors de la récupération des commandes.");
                orders.value = await response.json();
            } catch (err) {
                console.error("Erreur récupération commandes :", err);
                if (err.message !== "Erreur lors de la récupération des commandes.") {
                    error.value = "Impossible de charger les commandes.";
                }
            }
        }

        async function cancelOrder(orderId) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    error.value = "Veuillez vous reconnecter.";
                    router.push('/login');
                    return;
                }

                const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error("Impossible d'annuler la commande.");

                message.value = "Commande annulée avec succès.";
                fetchOrders(); // Recharger la liste des commandes
            } catch (err) {
                console.error("Erreur annulation commande :", err);
                error.value = "Échec de l'annulation.";
            }
        }

        function logout() {
            localStorage.removeItem('token');
            router.push('/login');
        }

        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        }

        function getStatusClass(status) {
            return {
                'pending': status === 'en attente',
                'completed': status === 'validée',
                'canceled': status === 'annulée'
            };
        }

        onMounted(() => {
            getUserInfo();
            fetchOrders();
        });

        return {
            userName, orders, message, error, cancelOrder, logout, formatDate, getStatusClass, isAdmin
        };
    }
};
</script>

<style scoped>
.dashboard {
    text-align: center;
    padding: 20px;
}

.logout-btn {
    background-color: #6066FA;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.logout-btn:hover {
    background-color: #d32f2f;
}

.table-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

table {
    width: 80%;
    border-collapse: collapse;
    text-align: center;
}

th, td {
    padding: 10px;
    border: 1px solid #ddd;
}

th {
    background-color: #F0F1FF;
}

.success {
    color: green;
}

.error {
    color: red;
}

.cancel-btn {
    background-color: #ff9800;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: #e68900;
}

/* Status colors */
.pending {
    color: orange;
    font-weight: bold;
}

.completed {
    color: green;
    font-weight: bold;
}

.canceled {
    color: red;
    font-weight: bold;
}
</style>
