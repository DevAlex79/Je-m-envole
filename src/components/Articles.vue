<template>
    <main id="articles">
        <article v-for="(article, index) in articles" :key="index" class="article">
            <div class="image">
                <a :href="'singlearticle.html?id=' + article.id" target="_blank"><img :src="article.image"
                        :alt="article.alt" style="width: auto; height: 100%;"></a>
            </div>
            <div class="texte-article">
                <a :href="'singlearticle.html?id=' + article.id" target="_blank">
                    <h2 :class="getCategorieClass(article.category)">{{ article.category }}</h2>
                    <h1 class="titre">{{ article.title }}</h1>
                </a>
                <p>{{ article.description }}</p>
            </div>
        </article>
    </main>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import SingleArticle from '@/components/SingleArticle.vue';

export default {
    name: 'Articles',
    //props: {
    //  articles: Array   // Propriété qui contient les articles mais redondance avec data ci-dessous
    //},
    components: {
        Header,
        Footer,
        SingleArticle
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
    },
    methods: {
        getCategorieClass(category) {
            return 'categorie-' + category.toLowerCase();
        }
    }
}

</script>

<style scoped>
#articles {
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px 5px 0px 0px;

}

.article {
    display: flex;
    margin-bottom: 15px;
    width: 100%;
    /* Ajustement pour occuper la largeur disponible */
    max-width: 706px;
    /* Limite de largeur pour chaque article */
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.05);

}

.image {
    max-width: 190px;
    margin-right: 15px;

}

img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 5px 5px 0px 0px;
}

.texte-article {
    flex-grow: 1;
    /* Pour que le texte occupe tout l'espace disponible */
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

.titre {
    color: #333;
    font-family: Poppins;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 30px;
    letter-spacing: -0.6px;
}

.categorie {
    width: 57px;
    height: 16px;
    border-radius: 3px;
    display: inline-flex;
    padding: 0px 10px 1px 10px;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
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

.active  {
    color: #6066FA;
}
</style>
