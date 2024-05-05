<template>
    <main id="articles">
        <article v-for="(article, index) in articles" :key="index">
            <div class="article">
                <div class="image">
                    <a :href="'singlearticle.html?id=' + article.id" target="_blank"><img :src="article.image" :alt="article.alt"></a>
                    <div class="texte-article">
                        <a :href="'singlearticle.html?id=' + article.id" target="_blank">
                            <h2 class="categorie-{{ article.category.toLowerCase() }}">{{ article.category }}</h2>
                            <h1 class="titre">{{ article.title }}</h1>
                        </a>
                        <p>{{ article.description }}</p>
                    </div>
                </div>
            </div>
        </article>
    </main>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Article from '@/components/Article.vue';

export default {
    name: 'Articles',
    //props: {
      //  articles: Array   // Propriété qui contient les articles mais redondance avec data ci-dessous
    //},
    components: {
        Header,
        Footer,
        Article
    },
    data() {
        return {
            articles: [] // Initialiser la liste d'articles à vide
        };
    },

    mounted() {
        // Fetch les données des articles et afficher chaque article dans la liste
        fetch('data/articles.json')
            .then(response => response.json())
            .then(articles => {
                this.articles = articles; // Mettez à jour la liste d'articles avec les données du fichier JSON
            })
            .catch(error => console.error('Erreur lors de la récupération des données des articles:', error));
    }
}

</script>

<style scoped>
#articles {
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.article {
    display: flex;
    margin-bottom: 15px;
    width: 100%; /* Ajustement pour occuper la largeur disponible */
    max-width: 706px; /* Limite de largeur pour chaque article */
}

.image {
    max-width: 190px;
    margin-right: 15px;
}

img {
    max-width: 100%;
    max-height: 100%;
}

.texte-article {
    width: 100%;
    color: #808080;
    font-family: Lato;
}

h2,
.titre {
    margin: 0;
}

p {
    margin: 0;
}

.active .principal{
    color: #6066FA;
}
</style>
