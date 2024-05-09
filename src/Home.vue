<template>
    <div>
        <!--<Header /> -->
        <div class="articles-container">
            <div v-for="article in articles" :key="article.id" class="column">
                <!-- router-link pour lier chaque article à la page SingleArticle -->
                <router-link :to="'/article/' + article.id">
                    <div class="article">
                        <img :src="article.image" :alt="article.alt" />
                        <div class="texte-article">
                            <h2 :class="'categorie-' + article.category.toLowerCase()">{{ article.category }}</h2>
                            <h1 class="titre">{{ article.title }}</h1>
                            <p>{{ article.description }}</p>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
        <!--<Footer /> -->
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Article from '@/components/Article.vue';
//import Articles from './components/Articles.vue';
//import SingleArticle from './components/SingleArticle.vue';
import Footer from '@/components/Footer.vue';


export default {
    name: 'Home',

    components: {
        Header, // Enregistrement du composant Header
        Article, // Enregistrement du composant Article
        //Articles, // Enregistrement du composant Articles
        //SingleArticle,
        Footer // Enregistrement du composant Footer
    },
    data() {
        return {
            articles: [
                {
                    id: 1,
                    image: 'src/jpg/vinicius-benedit--1GEAA8q3wk-unsplash.jpg',
                    alt: 'sushis',
                    category: 'Cuisine',
                    title: 'Des supers sushis que j\'ai mangés dans le sud du Japon',
                    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit...'
                },
                {
                    id: 2,
                    image: 'src/jpg/pelargoniums-for-europe-aHFlP2qKrxc-unsplash.jpg',
                    alt: 'homme qui jardine',
                    category: 'Jardin',
                    title: 'Jardiner pour s\'aérer la tête et profiter de la nature',
                    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit...'
                },
                {
                    id: 3,
                    image: 'src/jpg/victor-rodriguez-pWOdBS_l9LQ-unsplash.jpg',
                    alt: 'homme sautant dans l\'eau',
                    category: 'Loisirs',
                    title: 'Jump dans la vie, ou alors jump dans l\'eau',
                    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit...'
                },
                {
                    id: 4,
                    image: 'src/jpg/luca-bravo-O453M2Liufs-unsplash.jpg',
                    alt: 'barque navigant sur l\'eau',
                    category: 'Voyages',
                    title: 'Un paysage à couper le souffle en Italie',
                    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit...'
                }
                // Ajout d'autres articles au besoin
            ]
        };
    }
}
</script>

<style scoped>
/* Styles spécifiques à la mise en page de la page d'accueil */
.articles-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /*gap: 20px;*/
}

.column {
    width: 50%;
    /* Définir la largeur de .column */
    max-width: calc(40% - 60px);
    /* Limite la largeur de .column à 50% de la largeur de l'espace disponible (moins l'espacement entre les colonnes) */
    /*flex: 1 0 45%;
    /* Flex-grow: 1, Flex-shrink: 0, Flex-basis: 45% */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;
}

.article {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.05);
}

.texte-article {
    padding: 10px;
}

.texte-article p {
    color: #808080;
    font-family: Lato;
    font-size: 14px;
    font-style: normal;
}

h2 {
    font-size: 12px;
}

.categorie-cuisine,
.categorie-jardin,
.categorie-loisirs,
.categorie-voyages {
    width: 57px;
    height: 16px;
    border-radius: 3px;
    display: inline-flex;
    padding: 0px 10px 1px 10px;
    align-items: flex-start;
    gap: 10px;
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

.titre {
    color: #333;
    font-family: Poppins;
    font-size: 18px;
    font-weight: 700;
    line-height: 30px;
    letter-spacing: -0.6px;
}

img {
    width: 100%;
    height: 200px;
    border-radius: 5px 5px 0px 0px;
    /*object-fit: cover; /* Ajuste la taille de l'image pour qu'elle remplisse son conteneur */
}
</style>
