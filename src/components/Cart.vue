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
                <tr v-for="line in cart.lines.lines" :key="line.id"> <!--line.name-->
                    <td :style="{ color: '#000000' }">{{ line.title }}</td>
                    <!-- <td :style="{ color: '#000000' }">{{ line.quantity }}</td> -->
                    <td>
                        <div class="quantity-container">
                            <button @click="decreaseQuantity(line)" class="quantity-btn">-</button>
                            <span class="quantity-display">{{ line.quantity }}</span>
                            <button @click="increaseQuantity(line)" class="quantity-btn">+</button>
                            
                        </div>
                    </td>
                    <td :style="{ color: '#000000' }">{{ line.unitPrice ? line.unitPrice.toFixed(2) : '0.00' }}€</td>
                    <td :style="{ color: '#000000' }">{{ line.total ? line.total.toFixed(2) : '0.00' }}€</td>
                    <!-- <td><button @click="removeProductFromCart(line)" class="remove-row">Supprimer</button></td> -->
                    <td>
                        <button @click="removeProductFromCart(line)" class="remove-row">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>

                </tr>
            </tbody>
            <tfoot>
                
                <tr>
                    <td colspan="5">
                        <button @click="goToArticles" class="add-row-button">Ajouter un article</button>
                    </td>
                </tr>
                <tr>
                    <td colspan="5" style="text-align: right;">
                        <button @click="clearCart" class="clear-cart-button">Vider le panier</button>
                    </td>
                </tr>
                <tr>
                    <td colspan="5" style="text-align: right;">
                        <button @click="validateCart" class="validate-cart-button">
                        Valider mon panier
                    </button>
                    </td>
                </tr>             
                
            </tfoot>
        </table>
        
        <!-- Sélection du mode de livraison -->
        <div class="label" v-if="cart.shipment">
            <label>
                <input type="radio" name="livraison-type" value="relais" @change="updateShipmentType('relais')" :checked="cart.shipment.type === 'relais'">
                Relais Colis (5€)
            </label>
            <label>
                <input type="radio" name="livraison-type" value="domicile" @change="updateShipmentType('domicile')" :checked="cart.shipment.type === 'domicile'">
                À Domicile (12€)
            </label>
        </div>

        <div class="totals-container">
            <table class="totals-table">
                <tbody>
                    <tr>
                        <td style="color: #000000;">Total Articles:</td>
                        <td><span id="total-nombre-articles" :style="{ color: '#6066FA' }">{{ totalArticles }}</span>
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Cart',
    setup() {
        const cart = useCartStore();
        cart.initShipment();

        function goToArticles() {
            router.push({ name: 'Articles' }); // Redirection vers la page Articles
        }

        function increaseQuantity(line) {
            line.quantity++;
            line.total = line.unitPrice * line.quantity;
            cart.saveCartToLocalStorage();
        }

        function decreaseQuantity(line) {
            if (line.quantity > 1) {
                line.quantity--;
                line.total = line.unitPrice * line.quantity;
                cart.saveCartToLocalStorage();
            }
        }

        function removeProductFromCart(line) {
            cart.removeProductFromCart(line);
        }

        function updateShipmentType(type) {
            cart.updateShipmentType(type);
        }

        function clearCart() {
            cart.clearCart();
        }

        const router = useRouter();

        function validateCart() {
            if (cart.lines.lines.length === 0) {
                alert("Votre panier est vide !");
                return;
            }
            router.push({ name: 'Checkout' }); // avoir une route Checkout dans `router/index.js`
        }


        return {
            cart,
            //addRow,
            removeProductFromCart,
            updateShipmentType,
            clearCart,
            totalArticles: computed(() => cart.totalArticles),
            totalArticlesPrice: computed(() => cart.totalArticlesPrice),
            shipmentPrice: computed(() => cart.shipmentPrice),
            totalPrice: computed(() => cart.totalPrice),
            validateCart,
            goToArticles,
            increaseQuantity,
            decreaseQuantity
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
    background-color: #F0F1FF;

}

/* .remove-row {
    cursor: pointer;
    color: red;
    font-weight: bold;
    border: none;
    background: none;
    font-size: larger;
} */

.quantity-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px; /* Espacement horizontal entre les éléments */
}

.quantity-btn {
    background-color: #6066FA;
    color: white;
    border: none;
    padding: 5px 12px;
    margin: 0 8px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 3px;
}

.quantity-btn:hover {
    background-color: #4a50e1;
}

.quantity-display {
    font-size: 18px;
    font-weight: bold;
    min-width: 30px; /* Assure un bon alignement */
    text-align: center;
}

.remove-row {
    cursor: pointer;
    border: none;
    background: none;
    font-size: 18px;
    color: #6066FA;
}

.remove-row i {
    font-size: 18px;
}

.remove-row:hover {
    color: darkred;
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

.add-row-button:hover {
    color: #6066FA;
    background-color: #F0F1FF;
    /* Couleur de fond au survol */
}

.clear-cart-button {
    background-color: #FEE6E7; 
    color: #FA5158; 
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

.validate-cart-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.validate-cart-button {
    background-color: #F0F1FF;
    color: #6066FA;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
}

.validate-cart-button:hover {
    background-color: #6066FA;
    color: #F0F1FF;
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