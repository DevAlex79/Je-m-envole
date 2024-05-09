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
                    <h1>{{ article.title }}</h1>
                    <h2>{{ article.category }}</h2>
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
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = parseInt(urlParams.get('id'));

        // Fetch les données des articles pour obtenir les détails de l'article
        fetch('data/articles.json')
            .then(response => response.json())
            .then(articles => {
                // Utiliser l'ID pour récupérer les détails de l'article
                const articleDetails = articles.find(article => article.id === articleId);

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
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.05);
    gap: 15px;
}

.article-details {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px 5px 0px 0px;
    box-shadow: 3px 3px 3px 3px rgba(2, 2, 2, 0.09);
}

.image {
    margin-right: 20px;
}

.image img {
    max-width: 100%;
    height: auto;
}

.texte-article {
    max-width: 600px;
    color: #808080;
    font-family: Lato;
    font-size: 14px;
    font-style: normal;
}

.texte-article h2,
.texte-article h1,
.texte-article p {
    margin: 0;
}
</style>
