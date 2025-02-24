<template>
    <div class="dashboard-container">
        <h1>Tableau de bord de {{ sellerName }}</h1>
        <p>Bienvenue, {{ sellerName }} !</p>
        <button @click="logout">Se déconnecter</button>

        <h2>Créer un nouveau produit</h2>
        <form @submit.prevent="createProduct">
            <input type="text" v-model="title" placeholder="Nom du produit" required>
            <input type="text" v-model="description" placeholder="Description">
            <input type="number" v-model="price" placeholder="Prix" required>
            <input type="number" v-model="stock" placeholder="Stock" required>
            <select v-model="category">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <button type="submit">Ajouter</button>
        </form>

        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <h2>Liste de vos produits</h2>
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
                <tr v-for="product in products" :key="product.id">
                    <td>{{ product.name || "Nom indisponible" }}</td>
                    <td>{{ product.description || "Aucune description" }}</td>
                    <td>{{ product.price || "0" }}</td>
                    <td>{{ product.category ? product.category.name : 'Non défini' }}</td>
                    <td>{{ product.stock || "0" }}</td>
                </tr>
            </tbody>
</table>

    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
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

        onMounted(() => { 
            getUserInfo();
            fetchCategories(); 
        });

        return { title, description, price, stock, category, createProduct, products, categories, logout, successMessage, sellerName };
    }
};
</script>

<style scoped>
.dashboard-container { text-align: center; }

.success-message {
    color: green;
    font-weight: bold;
    margin-top: 10px;
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
    background-color: #f4f4f4;
}
</style>
