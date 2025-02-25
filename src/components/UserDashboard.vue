<template>
    <div class="dashboard">
        <h1>Tableau de bord de <span class="user-name"> {{ userName }}</span></h1>
        <p>Bienvenue, <span class="user-name">{{ userName }} ! </span> Consultez vos commandes et informations personnelles.</p>
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
                        <td><strong>#{{ order.id_order }}</strong></td>
                        <td><strong>{{ formatDate(order.created_at) }}</strong></td>
                        <td><strong>{{ order.total_price ? parseFloat(order.total_price).toFixed(2) : '0.00' }}</strong></td>
                        <td :class="getStatusClass(order.status)"><strong>{{ order.status }}</strong></td>
                        <td>
                            <button 
                                v-if="order.status === 'en attente' && isAdmin"
                                @click="cancelOrder(order.id_order)"
                                class="cancel-btn">
                                Annuler
                            </button>
                            <span v-else><strong>Aucune action</strong></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="orders.length > 0">
            <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">Précédent</button>
            <span>Page {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage >= totalPages" class="pagination-btn">Suivant</button>
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

         // Pagination des commandes
        const currentPage = ref(1);
        const ordersPerPage = 10;
        const totalPages = computed(() => Math.ceil(orders.value.length / ordersPerPage));

        const paginatedOrders = computed(() => {
            const start = (currentPage.value - 1) * ordersPerPage;
            return orders.value.slice(start, start + ordersPerPage);
        });

        function nextPage() {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        }

        function prevPage() {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        }

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
            userName, orders, message, error, cancelOrder, logout, formatDate, getStatusClass, isAdmin, 
            currentPage, ordersPerPage, totalPages, paginatedOrders, nextPage, prevPage
        };
    }
};
</script>

<style scoped>
.dashboard {
    text-align: center;
    padding: 20px;
}

.user-name {
    color: #6066FA;
    font-weight: bold;
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

/* 🔹 Styles de la pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    gap: 10px;
}

.pagination button {
    background-color: #F0F1FF;
    color: #6066FA;
    border: 1px solid #6066FA;
    padding: 8px 15px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s ease;
}

.pagination button:hover {
    background-color: #6066FA;
    color: #F0F1FF;
}

.pagination button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
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
