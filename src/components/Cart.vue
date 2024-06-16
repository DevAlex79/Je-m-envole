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
                    <td :style="{ color: '#000000' }">{{ line.title }}</td>
                    <td :style="{ color: '#000000' }">{{ line.quantity }}</td>
                    <td :style="{ color: '#000000' }">{{ line.unitPrice ? line.unitPrice.toFixed(2) : '0.00' }}€</td>
                    <td :style="{ color: '#000000' }">{{ line.total ? line.total.toFixed(2) : '0.00' }}€</td>
                    <td><button @click="removeProductFromCart(line)" class="remove-row">Supprimer</button></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5">
                        <button @click="addRow" class="add-row-button">Ajouter une ligne</button>
                    </td>
                </tr>
            </tfoot>
        </table>

        <div class="label">
            <label>
                <input type="radio" name="livraison-type" value="relais" @change="updateShipmentType('relais')" :checked="cart.shipment.type === 'relais'">
                Relais Colis (5€)
            </label>
            <label>
                <input type="radio" name="livraison-type" value="domicile" @change="updateShipmentType('domicile')" :checked="cart.shipment.type === 'domicile'">
                À Domicile (12€)
            </label>
            <!--<label>
                <input type="radio" name="livraison-type" value="relais" @change="updateShipmentType('relais')" :checked="cart.shipment.type.value === 'relais'">
                Relais Colis (5€)
            </label>
            <label>
                <input type="radio" name="livraison-type" value="domicile" @change="updateShipmentType('domicile')" :checked="cart.shipment.type.value === 'domicile'">
                À Domicile (12€)
            </label>-->
        </div>

        <div class="totals-container">
            <table class="totals-table">
                <tbody>
                    <tr>
                        <td style="color: #000000;">Total Articles:</td>
                        <td><span id="total-nombre-articles" :style="{ color: '#000000' }">{{ totalArticles }}</span>
                        </td>
                        <td style="color: #000000;">Prix Total Articles:</td>
                        <td><span id="prix-total-articles" :style="{ color: '#000000' }">{{
                    totalArticlesPrice.toFixed(2) }}</span>€</td>
                        <td style="color: #000000;">Livraison:</td>
                        <td><span id="livraison-price" :style="{ color: '#000000' }">{{ shipmentPrice.toFixed(2)
                                }}</span>€</td>
                        <td style="color: #000000;">Total Général:</td>
                        <td><span id="prix-total" :style="{ color: '#000000' }">{{ totalPrice.toFixed(2) }}</span>€</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { useCartStore } from '@/store/cartStore';
//import { Line } from '@/models/Line'

export default {
    name: 'Cart',
    setup() {
        const cart = useCartStore();
        //cart.loadCartFromLocalStorage(); // Charger le panier depuis le stockage local
        cart.initShipment();

        function addRow() {
            const newLine = { title: 'Nouvel article', quantity: 1, unitPrice: 0, total: 0 };
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
    },
    /*computed: {
        cart() {
            return useCartStore();
        }
    },*/
    mounted() {
        this.cart.initShipment();  
    //this.cart.loadCartFromLocalStorage();
    }
};
</script>

<style scoped>
h1 {
    font-family: Poppins;
    font-size: 25px;
    font-style: bold;
    text-align: center;
    color: #000000;
}

#cartBody {
    color: #000000;
    font-weight: 600;
}

table {
    width: 70%;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border-collapse: separate;
    /* Utiliser 'separate' pour gérer les bordures et le border-radius */
    border-spacing: 0;
    /* Pas d'espace entre les cellules */
    overflow: hidden;
}

#checkout {
    border-radius: 5px;
    /* Coins arrondis */
    overflow: hidden;
    /* Pour s'assurer que les coins du contenu suivent le border-radius */
    border: 1px solid #000000;
    /* Bordure pour rendre le border-radius visible */
}

thead tr:first-child th:first-child {
    border-top-left-radius: 5px;
    /* Coin supérieur gauche */
}

thead tr:first-child th:last-child {
    border-top-right-radius: 5px;
    /* Coin supérieur droit */
}

tfoot tr:last-child td:first-child {
    border-bottom-left-radius: 5px;
    /* Coin inférieur gauche */
}

tfoot tr:last-child td:last-child {
    border-bottom-right-radius: 5px;
    /* Coin inférieur droit */
}

th,
td {
    border: 1px solid #000000;
    padding: 8px;
    text-align: left;
    color: #000000 !important;
    /* texte noir */
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

.add-row-button {
    background-color: #6066FA;
    /* Couleur de fond */
    color: #fff;
    /* Couleur du texte */
    padding: 10px 20px;
    /* Padding */
    border: none;
    /* Pas de bordure */
    border-radius: 5px;
    /* Coins arrondis */
    cursor: pointer;
    /* Curseur de la main */
    font-weight: bold;
    /* Texte en gras */
}

.totals-container {
    margin-top: 20px;
}

.totals-container table {
    width: 70%;
    margin: 0 auto;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #000;
}

.totals-table {
    width: 100%;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #000000;
    /* Bordure noire */
}

.totals-table td {
    border: 1px solid #000;
    /* Bordure des cellules */
    padding: 8px;
    text-align: left;
    color: #000000 !important;
    /* Texte en noir */
}

.totals-container span {
    font-weight: bold;
    color: #000000 !important;
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
    color: #000000 !important;
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