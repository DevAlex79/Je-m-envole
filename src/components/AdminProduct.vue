<template>
    <div class="admin-products">
        <h1>Gestion des Produits</h1>

        <!-- Formulaire d'ajout/modification -->
        <form @submit.prevent="submitProduct">
            <label>Nom :</label>
            <input v-model="product.name" required>

            <label>Description :</label>
            <textarea v-model="product.description"></textarea>

            <label>Prix :</label>
            <input type="number" v-model="product.price" required>

            <label>Stock :</label>
            <input type="number" v-model="product.stock" required>

            <button type="submit">{{ editing ? 'Modifier' : 'Ajouter' }} le produit</button>
        </form>

        <!-- Liste des produits -->
        <h2>Produits existants</h2>
        <table>
            <tr>
                <th>Nom</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
            </tr>
            <tr v-for="prod in products" :key="prod.id">
                <td>{{ prod.name }}</td>
                <td>{{ prod.price }}€</td>
                <td>{{ prod.stock }}</td>
                <td>
                    <button @click="editProduct(prod)">Modifier</button>
                    <button @click="deleteProduct(prod.id)">Supprimer</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
    setup() {
        const products = ref([]);
        const product = ref({ name: "", description: "", price: 0, stock: 0 });
        const editing = ref(false);
        const token = localStorage.getItem("token");

        async function fetchProducts() {
            const res = await fetch("http://127.0.0.1:8000/api/admin/products", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            products.value = await res.json();
        }

        async function submitProduct() {
            const url = editing.value 
                ? `http://127.0.0.1:8000/api/admin/products/update/${product.value.id}`
                : "http://127.0.0.1:8000/api/admin/products/store";

            const method = editing.value ? "POST" : "POST";

            await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product.value)
            });

            fetchProducts();
            product.value = { name: "", description: "", price: 0, stock: 0 };
            editing.value = false;
        }

        function editProduct(prod) {
            product.value = { ...prod };
            editing.value = true;
        }

        async function deleteProduct(id) {
            await fetch(`http://127.0.0.1:8000/api/admin/products/delete/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchProducts();
        }

        onMounted(fetchProducts);

        return { products, product, editing, submitProduct, editProduct, deleteProduct };
    }
};
</script>

<style scoped>
.admin-products {
    width: 80%;
    margin: auto;
    text-align: center;
}
form {
    margin-bottom: 20px;
}
table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    border: 1px solid #ddd;
    padding: 10px;
}
button {
    margin: 5px;
    padding: 5px 10px;
    cursor: pointer;
}
</style>
