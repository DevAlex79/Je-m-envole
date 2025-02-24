<template>
    <div class="dashboard-container">
        <h1>Tableau de bord de {{ adminName }}</h1>
        <p>Bienvenue, {{ adminName }} !</p>

        <button @click="logout">Se déconnecter</button>

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
                        <td>{{ user.username }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ getRoleName(user.Roles_id_role) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination utilisateurs -->
        <div class="pagination">
            <button @click="prevUserPage" :disabled="userPage === 1">Précédent</button>
            <span>Page {{ userPage }}</span>
            <button @click="nextUserPage" :disabled="userPage >= totalUserPages">Suivant</button>
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
                        <td>{{ product.name || "Nom indisponible" }}</td>
                        <td>{{ product.description || "Aucune description" }}</td>
                        <td>{{ product.price || "0" }}</td>
                        <td>{{ product.category ? product.category.name : "Non défini" }}</td>
                        <td>
                            <input type="number" v-model="product.newStock" min="0" />
                        </td>
                        <td>
                            <button @click="updateStock(product)">Modifier stock</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination produits -->
        <div class="pagination">
            <button @click="prevProductPage" :disabled="productPage === 1">Précédent</button>
            <span>Page {{ productPage }}</span>
            <button @click="nextProductPage" :disabled="productPage >= totalProductPages">Suivant</button>
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

        onMounted(() => {
            fetchUsers();
            fetchProducts();
            getAdminInfo();
        });

        return {
            adminName,
            users, products, fetchUsers, fetchProducts, updateStock,
            getRoleName,
            // Pagination utilisateurs
            paginatedUsers, userPage, totalUserPages, nextUserPage, prevUserPage,
            // Pagination produits
            paginatedProducts, productPage, totalProductPages, nextProductPage, prevProductPage,
            logout
        };
    }
};
</script>

<style scoped>
.dashboard-container { text-align: center; }
.success { color: green; }
.error { color: red; }

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
    background-color: #f4f4f4;
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



</style>