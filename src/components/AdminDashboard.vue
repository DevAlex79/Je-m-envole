<template>
    <div class="dashboard-container">
        <h1>Tableau de bord de <span class="admin-name">{{ adminName }}</span></h1>
        <p>Bienvenue, <span class="admin-name">{{ adminName }}</span> !</p>


        <button @click="logout" class="logout-btn">Se déconnecter</button>

        <h2>Créer un nouvel utilisateur</h2>
        <form @submit.prevent="createUser">
            <input type="text" v-model="username" placeholder="Nom" required>
            <input type="email" v-model="email" placeholder="Email" required>
            <input type="password" v-model="password" placeholder="Mot de passe" required>
            <select v-model="role">
                <option value="Vendeur">Vendeur</option>
                <option value="Administrateur">Administrateur</option>
            </select>
            <button type="submit">Créer l'utilisateur</button>
        </form>
        <p v-if="message" class="success">{{ message }}</p>
        <p v-if="error" class="error">{{ error }}</p>

        <h2>Liste des utilisateurs</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in paginatedUsers" :key="user.id_user">
                        <td><strong>{{ user.username }}</strong></td>
                        <td><strong>{{ user.email }}</strong></td>
                        <td><strong>{{ getRoleName(user.Roles_id_role) }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination utilisateurs -->
        <div class="pagination">
            <button @click="prevUserPage" :disabled="userPage === 1" class="pagination-btn">Précédent</button>
            <span>Page {{ userPage }} / {{ totalUserPages }}</span>
            <button @click="nextUserPage" :disabled="userPage >= totalUserPages" class="pagination-btn">Suivant</button>
        </div>

        <h2>Liste des produits</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Prix (€)</th>
                        <th>Catégorie</th>
                        <th>Stock</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in paginatedProducts" :key="product.id_product">
                        <td><strong>{{ product.name || "Nom indisponible" }}</strong></td>
                        <td><strong>{{ product.description || "Aucune description" }}</strong></td>
                        <td><strong>{{ product.price || "0" }}</strong></td>
                        <td><strong>{{ product.category ? product.category.name : "Non défini" }}</strong></td>
                        <td>
                            <input type="number" v-model="product.newStock" min="0" />
                        </td>
                        <td>
                            <button @click="updateStock(product)" class="modify-stock-btn">Modifier stock</button>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination produits -->
        <div class="pagination">
            <button @click="prevProductPage" :disabled="productPage === 1" class="pagination-btn">Précédent</button>
            <span>Page {{ productPage }} / {{ totalProductPages }}</span>
            <button @click="nextProductPage" :disabled="productPage >= totalProductPages" class="pagination-btn">Suivant</button>
        </div>

        <h2>Liste des commandes</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Montant (€)</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in paginatedOrders" :key="order.id_order">
                        <td>#{{ order.id_order }}</td>
                        <td>{{ formatDate(order.created_at) }}</td>
                        <td>{{ order.client_name }}</td>
                        <td>{{ order.total_price ? parseFloat(order.total_price).toFixed(2) : '0.00' }}</td>
                        <td>{{ order.status }}</td>
                        <td>
                            <button @click="deleteOrder(order.id_order)" class="delete-btn">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination commandes -->
        <div class="pagination">
            <button @click="prevOrderPage" :disabled="orderPage === 1" class="pagination-btn">Précédent</button>
            <span>Page {{ orderPage }} / {{ totalOrderPages }}</span>
            <button @click="nextOrderPage" :disabled="orderPage >= totalOrderPages" class="pagination-btn">Suivant</button>
        </div>
    </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const users = ref([]);
        const products = ref([]);
        const orders = ref([]);
        const adminName = ref('Administrateur');

        // Liste des rôles disponibles
        const rolesMap = {
            2: "Vendeur",
            3: "Administrateur"
        };

        function getAdminInfo() {
            try {
                const userString = localStorage.getItem('user');

                if (!userString) {
                    console.error("Aucune donnée utilisateur trouvée dans LocalStorage.");
                    return;
                }

                const user = JSON.parse(userString);
                if (user.username) {
                    adminName.value = user.username;
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'administrateur:", error);
            }
        }

        function getRoleName(roleId) {
            return rolesMap[roleId] || "Utilisateur"; // Correction : affichage "Utilisateur" au lieu de "Inconnu"
        }

        // Pagination utilisateurs
        const userPage = ref(1);
        const usersPerPage = 10;
        const totalUserPages = computed(() => Math.ceil(users.value.length / usersPerPage));
        const paginatedUsers = computed(() => {
            const start = (userPage.value - 1) * usersPerPage;
            return users.value.slice(start, start + usersPerPage);
        });

        function nextUserPage() {
            if (userPage.value < totalUserPages.value) userPage.value++;
        }

        function prevUserPage() {
            if (userPage.value > 1) userPage.value--;
        }

        // Pagination produits
        const productPage = ref(1);
        const productsPerPage = 10;
        const totalProductPages = computed(() => Math.ceil(products.value.length / productsPerPage));
        const paginatedProducts = computed(() => {
            const start = (productPage.value - 1) * productsPerPage;
            return products.value.slice(start, start + productsPerPage);
        });

        function nextProductPage() {
            if (productPage.value < totalProductPages.value) productPage.value++;
        }

        function prevProductPage() {
            if (productPage.value > 1) productPage.value--;
        }

         // Pagination commandes
        const orderPage = ref(1);
        const ordersPerPage = 5;
        const totalOrderPages = computed(() => Math.ceil(orders.value.length / ordersPerPage));
        const paginatedOrders = computed(() => {
            const start = (orderPage.value - 1) * ordersPerPage;
            return orders.value.slice(start, start + ordersPerPage);
        });

        function nextOrderPage() {
            if (orderPage.value < totalOrderPages.value) orderPage.value++;
        }

        function prevOrderPage() {
            if (orderPage.value > 1) orderPage.value--;
        }


        async function fetchUsers() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                console.log("Utilisateurs reçus depuis API :", data);
                users.value = data;
            } catch (err) {
                console.error("Erreur de récupération des utilisateurs", err);
            }
        }

        async function fetchProducts() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/articles', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Erreur lors de la récupération des produits");

                const data = await response.json();
                console.log("Produits reçus depuis API :", data);

                if (data.Articles && Array.isArray(data.Articles)) {
                    products.value = data.Articles.map(p => ({ ...p, newStock: p.stock }));
                } else {
                    console.error("Format inattendu des produits :", data);
                    products.value = [];
                }
            } catch (err) {
                console.error("Erreur de récupération des produits", err);
            }
        }

        async function fetchOrders() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Erreur de récupération des commandes");
                orders.value = await response.json();
            } catch (err) {
                console.error("Erreur de récupération des commandes", err);
            }
        }

        async function deleteOrder(orderId) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Erreur de suppression de la commande");
                orders.value = orders.value.filter(order => order.id_order !== orderId);
            } catch (err) {
                console.error("Erreur lors de la suppression de la commande", err);
            }
        }

        async function updateStock(product) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://127.0.0.1:8000/api/articles/${product.id_product}/stock`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ stock: product.newStock })
                });

                if (!response.ok) throw new Error("Erreur de mise à jour du stock");

                alert("Stock mis à jour avec succès !");
                fetchProducts();
            } catch (err) {
                console.error("Erreur lors de la mise à jour du stock", err);
            }
        }

        function logout() {
            localStorage.removeItem('token');
            router.push('/login');
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
        }

        onMounted(() => {
            fetchUsers();
            fetchProducts();
            getAdminInfo();
            fetchOrders();
        });

        return {
            adminName,
            users, products, fetchUsers, fetchProducts, updateStock,
            getRoleName,
            // Pagination utilisateurs
            paginatedUsers, userPage, totalUserPages, nextUserPage, prevUserPage,
            // Pagination produits
            paginatedProducts, productPage, totalProductPages, nextProductPage, prevProductPage,
            logout,
            // Pagination orders
            paginatedOrders, orderPage, totalOrderPages, nextOrderPage, prevOrderPage,
            orders, deleteOrder, formatDate
        };
    }
};
</script>

<style scoped>
.dashboard-container {
    text-align: center; 
}

.success { 
    color: green; 
}

.error { 
    color: red; 
}

.admin-name {
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

/* Styles des champs de formulaire */
form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
}

input, select {
    width: 50%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: 0.3s ease;
}

input:focus, select:focus {
    border-color: #6066FA;
    outline: none;
    box-shadow: 0 0 5px rgba(96, 102, 250, 0.5);
}

/* Bouton de création d'utilisateur */
button[type="submit"] {
    background-color: #6066FA; 
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    margin-top: 10px;
    transition: 0.3s ease;
}

button[type="submit"]:hover {
    background-color: #F0F1FF;
    color: #6066FA;
    border: 1px solid #6066FA;
}

/* Pagination */
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

.pagination span {
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

/* Bouton de suppression */
.delete-btn {
    background-color: #FA5158;
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s ease;
}

.delete-btn:hover {
    background-color: #d32f2f;
}

/* Tableau et mise en page */
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

body {
    color: #333; /* Texte plus foncé */
    font-weight: 500; /* Un peu plus épais */
}

h1, h2 {
    color: #222; /* Titres encore plus foncés */
    font-weight: 600;
}

th, td {
    color: #444; /* Assombrit le texte des tables */
}

/* Bouton de modification du stock */
.modify-stock-btn {
    background-color: #F0F1FF;
    color: #6066FA;
    border: 1px solid #6066FA;
    padding: 8px 15px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s ease;
}

.modify-stock-btn:hover {
    background-color: #6066FA;
    color: #F0F1FF;
}


</style>