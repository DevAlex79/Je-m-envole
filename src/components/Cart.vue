<template>
    <div>
        <h1>Votre Panier</h1>

        <div class="scroll-container">
        <!-- Flèche gauche -->
        <button v-if="showLeftArrow" class="scroll-arrow left-arrow" @click="scrollTable(-1)">&#8249;</button>

            <!-- Conteneur du tableau avec scroll horizontal -->
            <div class="table-container" ref="tableContainer">
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
                            <td :style="{ color: '#000000' }">{{ line.unitPrice ? line.unitPrice.toFixed(2) : '0.00' }}€
                            </td>
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
            </div>
        </div>

        <!-- Sélection du mode de livraison -->
        <div class="label" v-if="cart.shipment">
            <label>
                <input type="radio" name="livraison-type" value="relais" @change="updateShipmentType('relais')"
                    :checked="cart.shipment.type === 'relais'">
                Relais Colis (5€)
            </label>
            <label>
                <input type="radio" name="livraison-type" value="domicile" @change="updateShipmentType('domicile')"
                    :checked="cart.shipment.type === 'domicile'">
                À Domicile (12€)
            </label>
        </div>

        <!-- Conteneur du tableau des totaux avec scroll horizontal -->
        <div class="totals-container">
            <div class="table-container">
                <table class="totals-table">
                    <tbody>
                        <tr>
                            <td style="color: #000000;">Total Articles:</td>
                            <td><span id="total-nombre-articles" :style="{ color: '#6066FA' }">{{ totalArticles
                                    }}</span>
                            </td>
                            <td style="color: #000000;">Prix Total Articles:</td>
                            <td><span id="prix-total-articles" :style="{ color: '#000000' }">{{
                                totalArticlesPrice.toFixed(2) }}</span>€</td>
                            <td style="color: #000000;">Livraison:</td>
                            <td><span id="livraison-price" :style="{ color: '#000000' }">{{ shipmentPrice.toFixed(2)
                                    }}</span>€</td>
                            <td style="color: #000000;">Total Général:</td>
                            <td><span id="prix-total" :style="{ color: '#000000' }">{{ totalPrice.toFixed(2) }}</span>€
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Flèche droite -->
            <button v-if="showRightArrow" class="scroll-arrow right-arrow" @click="scrollTable(1)">&#8250;</button>
        </div>
    </div>
</template>

<script>
import { useCartStore } from '@/store/cartStore';
import { computed, onMounted, ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Cart',
    setup() {
        const cart = useCartStore();
        cart.initShipment();
        const router = useRouter();
        const tableContainer = ref(null);
        const showLeftArrow = ref(false);
        const showRightArrow = ref(false);

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

        function validateCart() {
            if (cart.lines.lines.length === 0) {
                alert("Votre panier est vide !");
                return;
            }
            router.push({ name: 'Checkout' });
        }

        function scrollTable(direction) {
            if (!tableContainer.value) return;
            tableContainer.value.scrollBy({ left: direction * 200, behavior: 'smooth' });
        }

        // Gestion du scroll pour afficher les flèches de navigation
        function checkScroll() {
            if (!tableContainer.value) return;
            showLeftArrow.value = tableContainer.value.scrollLeft > 0;
            showRightArrow.value = tableContainer.value.scrollLeft < tableContainer.value.scrollWidth - tableContainer.value.clientWidth;
        }

        // Ajout d'événements au montage
        onMounted(() => {
            checkScroll();
            tableContainer.value?.addEventListener('scroll', checkScroll);
        });

        // Suppression des écouteurs lors du démontage
        onUnmounted(() => {
            tableContainer.value?.removeEventListener('scroll', checkScroll);
        });

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
            decreaseQuantity,
            tableContainer,
            scrollTable,
            showLeftArrow,
            showRightArrow
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

/* Conteneur principal pour gérer le scroll et les flèches */
.scroll-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
}

/* Conteneur du tableau avec scroll horizontal */
.table-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    /* Améliore le défilement sur mobile */
}

/* Style des flèches de navigation */
.scroll-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(96, 102, 250, 0.8);
    color: white;
    border: none;
    padding: 12px 18px;
    font-size: 20px;
    cursor: pointer;
    border-radius: 50%;
    z-index: 10;
    transition: background 0.3s;
}

.scroll-arrow:hover {
    background-color: rgba(96, 102, 250, 1);
}

.left-arrow {
    left: 10px;
}

.right-arrow {
    right: 10px;
}

table {
    /* width: 70%;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border-collapse: separate; */
    /* Utiliser 'separate' pour gérer les bordures et le border-radius */
    /* border-spacing: 0; */
    /* Pas d'espace entre les cellules */
    /* overflow: hidden; */
    width: 100%;
    min-width: 600px;
    margin-top: 20px;
    border-collapse: collapse;
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
}

th {
    background-color: #F0F1FF;
    border: 1px solid #000000;

}

.totals-container {
    width: 100%;
    overflow-x: auto;
}

.quantity-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    /* Espacement horizontal entre les éléments */
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
    min-width: 30px;
    /* Assure un bon alignement */
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

/* Rend le tableau des totaux plus flexible */
.totals-container {
    width: 100%;
    display: flex;
    justify-content: center;
    overflow-x: auto;
    margin-top: 20px;
}

/* Applique le même style que le tableau des articles */
.totals-table {
    width: 70%;
    max-width: 800px;
    border-collapse: collapse;
    border: 1px solid #000000;
    background-color: white;
    border-radius: 5px;
    overflow: hidden;
    text-align: center;
}

/* Cellules du tableau */
.totals-table td {
    padding: 10px;
    border: 1px solid #000;
    font-weight: bold;
    color: #000000;
    text-align: center;
}

/* Responsive - Tablette */
@media screen and (max-width: 1024px) {
    .totals-table {
        width: 90%;
        font-size: 14px;
    }

    th,
    td {
        font-size: 14px;
        padding: 8px;
    }
}

/* Responsive - Mobile */
@media screen and (max-width: 768px) {

    /* .totals-container {
        justify-content: center;
        padding: 10px;
    }

    .totals-table {
        width: 100%;
        font-size: 14px;
    }

    .totals-table td {
        padding: 8px;
    } */

    .scroll-container {
        flex-direction: row;
        justify-content: center;
        position: relative;
    }

    .scroll-arrow {
        font-size: 16px;
        padding: 8px 12px;
    }
    .table-container {
        overflow-x: auto;
        /* Assurer le scroll */
    }

    table {
        font-size: 14px;
    }

    th,
    td {
        font-size: 12px;
        /* Réduction de la taille de la police */
        padding: 6px;
    }

    .quantity-container {
        flex-direction: column;
        /* Éviter trop d'espace horizontal */
        align-items: center;
    }

    .quantity-btn {
        padding: 4px 8px;
        /* Réduction des boutons */
        font-size: 14px;
    }

    .totals-table {
        width: 100%;
        /* Adapter aux petits écrans */
        font-size: 12px;
    }

    .totals-table td {
        padding: 6px;
    }

    .scroll-arrow {
        font-size: 16px;
        padding: 8px 12px;
    }
}

</style>