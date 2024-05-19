<!--  
<template>
    <main id="cart">
        <h1>Mon Panier</h1>
        <div v-if="cartItems.length">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <img :src="item.image" :alt="item.title" />
                <div>
                    <h2>{{ item.title }}</h2>
                    <p>{{ item.price }} €</p>
                    <p>Quantité : {{ item.quantity }}</p>
                    <button @click="removeItem(item.id)">Retirer</button>
                </div>
            </div>
            <div class="cart-summary">
                <p>Total : {{ totalPrice }} €</p>
                <button @click="clearCart">Vider le panier</button>
            </div>
        </div>
        <div v-else>
            <p>Votre panier est vide.</p>
        </div>
    </main>
</template>-->

<template>
    <div>
        <h1>Votre Panier</h1>
        <table id="checkout">
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Prix total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="cartBody">
                <tr v-for="line in cart.lines.lines" :key="line.name">
                    <td>{{ line.name }}</td>
                    <td>{{ line.quantity }}</td>
                    <td>{{ line.unitPrice }}€</td>
                    <td>{{ line.total }}€</td>
                    <td><button @click="removeProductFromCart(line)" class="remove-row">Supprimer</button></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5">
                        <button @click="addRow">Ajouter une ligne</button>
                    </td>
                </tr>
            </tfoot>
        </table>

        <div class="label">
            <label>
                <input type="radio" name="livraison-type" value="relais" @change="updateShipmentType('relais')" checked>
                Relais Colis (5€)
            </label>
            <label>
                <input type="radio" name="livraison-type" value="domicile" @change="updateShipmentType('domicile')"> À
                Domicile (12€)
            </label>
        </div>

        <div class="totals-container">
            <table>
                <tbody>
                    <tr>
                        <td>Total Articles:</td>
                        <td><span id="total-nombre-articles">{{ totalArticles }}</span></td>
                        <td>Prix Total Articles:</td>
                        <td><span id="prix-total-articles">{{ totalArticlesPrice }}</span>€</td>
                        <td>Livraison:</td>
                        <td><span id="livraison-price">{{ shipmentPrice }}</span>€</td>
                        <td>Total Général:</td>
                        <td><span id="prix-total">{{ totalPrice }}</span>€</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { useCartStore } from '@/store/cartStore';
import { Line } from '@/models/Line'

export default {
    name: 'Cart',
    setup() {
        const cart = useCartStore();

        function addRow() {
            const newLine = new Line('Nouvel article', 0, 1);
            cart.addProductToCart(newLine);
        }

        function removeProductFromCart(line) {
            cart.removeProductFromCart(line);
        }

        function updateShipmentType(type) {
            cart.updateShipmentType(type);
        }

        return {
            cart,
            addRow,
            removeProductFromCart,
            updateShipmentType,
            totalArticles: cart.totalArticles,
            totalArticlesPrice: cart.totalArticlesPrice,
            shipmentPrice: cart.shipmentPrice,
            totalPrice: cart.totalPrice
        };
    }
};
</script>

<style scoped>
h1 {
    font-family: Poppins;
    font-size: 25px;
    font-style: bold;
    text-align: center;
}

#cartBody {
    color: #000000;
    font-weight: 600;
}

table {
    width: 70%;
    margin: 0 auto;
    border-collapse: collapse;
    margin-top: 20px;
    margin-bottom: 20px;
}

th,
td {
    border: 1px solid #000000;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.remove-row {
    cursor: pointer;
    color: red;
    font-weight: bold;
    border: none;
    background: none;
    font-size: larger;
}

.totals-container {
    margin-top: 20px;
}

.totals-container table {
    border: 1px solid #ddd;
    color: #000000;
    font-weight: 600;
}

.totals-container td {
    padding: 8px;
    text-align: left;
}

.totals-container span {
    font-weight: bold;
}

.label {
    width: 70%;
    color: #000000;
    font-weight: 600;
}

label {
    display: block;
    margin: 0 11vw;
    padding: 5px;
}


/*#cart {
    padding: 20px;
}

.cart-item {
    display: flex;
    margin-bottom: 20px;
}

.cart-item img {
    width: 100px;
    height: auto;
    margin-right: 20px;
}

.cart-summary {
    margin-top: 20px;
    font-size: 20px;
}*/
</style>