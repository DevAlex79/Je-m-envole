<template>
    <div class="dashboard-container">
        <h1>Tableau de bord de <span class="seller-name"> {{ sellerName }}</span></h1>
        <p>Bienvenue, <span class="seller-name">{{ sellerName }} !</span></p>
        <button @click="logout" class="logout-btn">Se déconnecter</button>

        <h2>Créer un nouveau produit</h2>
        <form @submit.prevent="createProduct">
            <input type="text" v-model="title" placeholder="Nom du produit" required>
            <input type="text" v-model="description" placeholder="Description">
            <input type="number" v-model="price" placeholder="Prix" required>
            <input type="number" v-model="stock" placeholder="Stock" required>
            <select v-model="category">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <button type="submit" class="add-btn">Ajouter</button>
        </form>

        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <h2>Liste de vos produits</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Prix (€)</th>
                        <th>Catégorie</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in paginatedProducts" :key="product.id">
                        <td><strong>{{ product.name || "Nom indisponible" }}</strong></td>
                        <td><strong>{{ product.description || "Aucune description" }}</strong></td>
                        <td><strong>{{ product.price || "0" }}</strong></td>
                        <td><strong>{{ product.category ? product.category.name : 'Non défini' }}</strong></td>
                        <td><strong>{{ product.stock || "0" }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination produits -->
        <div class="pagination" v-if="products.length > 0">
            <button @click="prevProductPage" :disabled="productPage === 1" class="pagination-btn">Précédent</button>
            <span>Page {{ productPage }} / {{ totalProductPages }}</span>
            <button @click="nextProductPage" :disabled="productPage >= totalProductPages"
                class="pagination-btn">Suivant</button>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const title = ref('');
        const description = ref('');
        const price = ref('');
        const stock = ref('');
        const category = ref('');
        const products = ref([]);
        const categories = ref([]);
        const successMessage = ref('');
        const sellerName = ref('Vendeur');
        const sellerId = ref(null);

        function getUserInfo() {
            try {
                const userString = localStorage.getItem('user');
                console.log("Données brutes du LocalStorage:", userString); // Debugging

                if (!userString) {
                    console.error("Aucune donnée utilisateur trouvée dans LocalStorage.");
                    logout();
                    return;
                }

                const user = JSON.parse(userString);

                // Vérifier si les données utilisateur sont correctes
                if (!user.id_user || !user.username) {
                    console.error("Données utilisateur invalides:", user);
                    logout();
                    return;
                }

                sellerName.value = user.username; // Correction pour afficher le bon nom du vendeur
                sellerId.value = user.id_user; // Correction pour récupérer l'ID du vendeur
                fetchProducts(); // Chargement des produits après récupération du vendeur
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error);
                logout();
            }
        }

        async function fetchProducts() {
            if (!sellerId.value) return; // Vérifier qu'on a bien l'ID du vendeur connecté

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://127.0.0.1:8000/api/articles?seller_id=${sellerId.value}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Erreur lors de la récupération des produits");

                const data = await response.json();
                console.log("Produits reçus depuis API :", data); // Debugging

                // Assurer que la clé `Articles` contient bien la liste des produits
                if (data.Articles && Array.isArray(data.Articles)) {
                    products.value = data.Articles;
                } else {
                    console.error("Format inattendu des produits :", data);
                    products.value = [];
                }
            } catch (err) {
                console.error("Erreur de récupération des produits du vendeur", err);
            }
        }


        async function fetchCategories() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/categories');
                categories.value = await response.json();
            } catch (err) {
                console.error("Erreur de récupération des catégories", err);
            }
        }

        async function createProduct() {
            const token = localStorage.getItem('token');
            if (!sellerId.value) return;

            try {
                const response = await fetch('http://127.0.0.1:8000/api/articles', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title.value,
                        description: description.value,
                        price: price.value,
                        stock: stock.value,
                        categories_id_category: category.value,
                        users_id_user: sellerId.value // Ajout de l'ID du vendeur
                    })
                });

                if (!response.ok) throw new Error("Erreur lors de l'ajout");

                // Réinitialisation du formulaire
                title.value = '';
                description.value = '';
                price.value = '';
                stock.value = '';
                category.value = '';

                // Affichage du message de confirmation
                successMessage.value = "Produit ajouté avec succès !";

                // Rafraîchir la liste des produits du vendeur uniquement
                fetchProducts();

                // Masquer le message après 3 secondes
                setTimeout(() => { successMessage.value = ''; }, 3000);
            } catch (err) {
                console.error(err);
            }
        }

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
        }

        // Pagination des produits
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

        onMounted(() => {
            getUserInfo();
            fetchCategories();
        });

        return { title, description, price, stock, category, createProduct, products, categories, logout, successMessage, sellerName, productPage, totalProductPages, paginatedProducts, nextProductPage, prevProductPage };
    }
};
</script>

<style scoped>
.dashboard-container {
    text-align: center;
}

.success-message {
    color: green;
    font-weight: bold;
    margin-top: 10px;
}

.seller-name {
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

/* Formulaire */
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

.add-btn {
    background-color: #6066FA;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    font-size: 16px;
    transition: 0.3s ease;
}

.add-btn:hover {
    background-color: #F0F1FF;
    color: #6066FA;
    border: 1px solid #6066FA;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
}

th {
    background-color: #F0F1FF;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    gap: 10px;
}

.pagination-btn {
    background-color: #F0F1FF;
    color: #6066FA;
    border: 1px solid #6066FA;
    padding: 8px 15px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s ease;
}

.pagination-btn:hover {
    background-color: #6066FA;
    color: #F0F1FF;
}

.pagination-btn:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
}

.pagination span {
    font-weight: bold;
    font-size: 16px;
    color: #333;
}
</style>
