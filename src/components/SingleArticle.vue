<template>
    <div>
        <!--<Header />-->
        <!--Contenu de l'article-->
        <main id="articleDetails">
            <div class="article-details">
                <div class="image">
                    <img :src="article.image" :alt="article.title">
                </div>
                <div class="texte-article">
                    <h2 :class="getCategorieClass(article.category)">{{ article.category }}</h2>
                    <h1>{{ article.title }}</h1>
                    <p>{{ article.description }}</p>
                    <p class="price">Prix: <span class="price-value">{{ article.price }} €</span></p>
                    <button :class="getButtonClass(article.category)" @click="addToCart(article)">Ajouter au
                        panier</button>
                </div>
            </div>
        </main>
        <!-- Afficher le message de succès -->
        <div v-if="showSuccessMessage" class="success-message">
            Article ajouté au panier
        </div>
        <!--<Footer />-->
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { useCartStore } from '@/store/cartStore';



export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            article: {}, // Initialise l'objet article avec des données vides
            showSuccessMessage: false,
            cart: useCartStore(), // Utilise le store dans la propriété cart
        };
    },
    methods: {
        getCategorieClass(category) {
            switch (category) {
                case 'Cuisine': return 'categorie-cuisine';
                case 'Jardin': return 'categorie-jardin';
                case 'Loisirs': return 'categorie-loisirs';
                case 'Voyages': return 'categorie-voyages';
                default: return '';
            }
        },
        getButtonClass(category) {
            switch (category) {
                case 'Cuisine': return 'button-cuisine';
                case 'Jardin': return 'button-jardin';
                case 'Loisirs': return 'button-loisirs';
                case 'Voyages': return 'button-voyages';
                default: return '';
            }
        },
        addToCart(article) {
            console.log('Adding to cart:', article);
            // Ajouter le prix unitaire au produit avant de l'ajouter au panier
            const product = { ...article, unitPrice: article.price };
            // Appeler la méthode addProductToCart du store via la propriété cart
            this.cart.addProductToCart(product);

            // Afficher le message de succès
            this.showSuccessMessage = true;

            // Cacher le message après quelques secondes
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 3000);

            // Redirigez l'utilisateur vers la page du panier
            this.$router.push({ name: 'Cart' });
        },
    },
    mounted() {
        // Récupérer l'ID de l'article depuis l'URL
        //const urlParams = new URLSearchParams(window.location.search);
        //const articleId = parseInt(urlParams.get('id'));

        // Récupérer l'ID de l'article à partir des paramètres de l'itinéraire
        const articleId = parseInt(this.$route.params.id, 10); // Convertir en nombre
        //const articleId = this.$route.params.id;
        console.log("ID de l'article récupéré :", articleId);

        // Fetch les données des articles pour obtenir les détails de l'article
        fetch('../data/articles.json')
            .then(response => response.json())
            .then(articles => {
                //console.log("Liste des articles :", articles);
                // Utiliser l'ID pour récupérer les détails de l'article
                const articleDetails = articles.find(article => article.id === articleId);
                console.log("Détails de l'article trouvé :", articleDetails);

                /*if (!articleDetails) {
                    console.error('Article non trouvé.');
                } else {
                    // Mettre à jour la donnée de l'article
                    this.article = articleDetails;
                }*/
                if (articleDetails) {
                    this.article = articleDetails;
                } else {
                    console.error('Article non trouvé.');
                }
            })
            .catch(error => console.error('Erreur lors de la récupération des données de l\'article:', error));
    }
};
</script>

<style scoped>
#articleDetails {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* Met en colonne les éléments enfants */
    gap: 20px;
    /* Ajoute un espacement entre les éléments */
    padding: 20px;
    /* Ajoute un peu d'espace autour du contenu */
}

.article-details {
    display: flex;
    flex-direction: column;
    /* Met en colonne les éléments enfants */
    align-items: center;
    max-width: 600px;
    /* Limite la largeur de la zone de contenu */
    /*text-align: center; /* Centre le texte */
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 1);
}

.image {
    margin-bottom: 20px;
    /* Ajoute un peu d'espace en bas de l'image */
}

.image img {
    max-width: 100%;
    height: auto;
    border-radius: 5px 5px 0px 0px;
}

.texte-article {
    color: #808080;
    font-family: Lato;
    font-size: 14px;
    font-style: normal;
    /*text-align: center; /* Centre le texte */
}

.texte-article h1,
.texte-article h2 {
    margin: 10px 0;
    /* Ajoute un peu d'espace autour des titres */
}

.texte-article h2 {
    /*color: #FA5158;
    background-color: #FEE6E7;*/
    width: 57px;
    height: 16px;
}

.texte-article h1 {
    font-size: 22px;
    font-style: normal;
    color: #333;
}

.texte-article p {
    margin: 0;
    /* Supprime les marges par défaut des paragraphes */
}

.categorie-cuisine {
    color: #FA5158;
    background-color: #FEE6E7;
}

.categorie-jardin {
    color: #44D382;
    background-color: #eafaf1;
}

.categorie-loisirs {
    color: #56CFE1;
    background: #E9F9FB;
}

.categorie-voyages {
    color: #F39E30;
    background-color: #fef4e7;
}

.price {
    font-weight: bold;
    /* Rend le texte en gras */
}

.price-value {
    color: black;
    /* Définit la couleur du texte en noir */
}

button {
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.button-cuisine {
    background-color: #FA5158;
}

.button-jardin {
    background-color: #44D382;
}

.button-loisirs {
    background-color: #56CFE1;
}

.button-voyages {
    background-color: #F39E30;
}

.success-message {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #44D382;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}
</style>
