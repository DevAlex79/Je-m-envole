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
                    <h2>{{ article.category }}</h2>
                    <h1>{{ article.title }}</h1>
                    <p>{{ article.description }}</p>
                </div>
            </div>
        </main>

        <!--<Footer />-->
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';


export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            article: {} // Initialisez l'objet article avec des données vides
        };
    },
    mounted() {
        // Récupérer l'ID de l'article depuis l'URL
        //const urlParams = new URLSearchParams(window.location.search);
        //const articleId = parseInt(urlParams.get('id'));

        // Récupérer l'ID de l'article à partir des paramètres de l'itinéraire
        const articleId = parseInt(this.$route.params.id); // Convertir en nombre
        //const articleId = this.$route.params.id;
        console.log("ID de l'article récupéré :", articleId);

        // Fetch les données des articles pour obtenir les détails de l'article
        fetch('../data/articles.json')
            .then(response => response.json())
            .then(articles => {
                console.log("Liste des articles :", articles);
                // Utiliser l'ID pour récupérer les détails de l'article
                const articleDetails = articles.find(article => article.id === articleId);
                console.log("Détails de l'article trouvé :", articleDetails);

                if (!articleDetails) {
                    console.error('Article non trouvé.');
                } else {
                    // Mettre à jour la donnée de l'article
                    this.article = articleDetails;
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
    flex-direction: column; /* Met en colonne les éléments enfants */
    gap: 20px; /* Ajoute un espacement entre les éléments */
    padding: 20px; /* Ajoute un peu d'espace autour du contenu */
}

.article-details {
    display: flex;
    flex-direction: column; /* Met en colonne les éléments enfants */
    align-items: center;
    max-width: 600px; /* Limite la largeur de la zone de contenu */
    /*text-align: center; /* Centre le texte */
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 1);
}

.image {
    margin-bottom: 20px; /* Ajoute un peu d'espace en bas de l'image */
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
    margin: 10px 0; /* Ajoute un peu d'espace autour des titres */
}

.texte-article h2 {
    color: #FA5158;
    background-color: #FEE6E7;
    width: 57px;
    height: 16px;
}

.texte-article h1 {
    font-size: 22px;
    font-style: normal;
    color: #333;
}

.texte-article p {
    margin: 0; /* Supprime les marges par défaut des paragraphes */
}
</style>

