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
//import Article from '@/components/Article.vue';
//import Articles from './components/Articles.vue';
import SingleArticle from './components/SingleArticle.vue';
import Footer from '@/components/Footer.vue';


export default {
    name: 'Home',

    components: {
        Header, // Enregistrement du composant Header
        //Article, // Enregistrement du composant Article
        //Articles, // Enregistrement du composant Articles
        SingleArticle,
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
/* Conteneur principal des articles */
.articles-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1200px; /* Centrage et limite de largeur */
    margin: 40px auto;
    gap: 20px; /* Espacement uniforme */
}

.column {
    width: 50%;
    /* Définir la largeur de .column */
    max-width: calc(50% - 20px);
    max-width: 500px; /* Limite la largeur */
    /* Limite la largeur de .column à 50% de la largeur de l'espace disponible (moins l'espacement entre les colonnes) */
    /*flex: 1 0 45%;
    /* Flex-grow: 1, Flex-shrink: 0, Flex-basis: 45% */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
}

/* Article individuel */
.article {
    width: 100%;
    background: white;
    border-radius: 5px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s ease-in-out;
}

.article:hover {
    transform: scale(1.03);
}

/* Image de l'article */
.article img {
    width: 100%;
    height: auto;
    border-radius: 5px 5px 0 0;
    object-fit: cover;
}

/* Contenu texte de l'article */
.texte-article {
    padding: 15px;
    text-align: left;
}

/* Catégories colorées */
h2 {
    font-size: 12px;
    font-weight: bold;
    padding: 5px 10px;
    display: inline-block;
    border-radius: 5px;
}

.categorie-cuisine {
    color: #FA5158;
    background-color: #FEE6E7;
}

.categorie-jardin {
    color: #44D382;
    background-color: #EAF5EA;
}

.categorie-loisirs {
    color: #56CFE1;
    background: #E9F9FB;
}

.categorie-voyages {
    color: #F39E30;
    background-color: #FEF4E7;
}

/* Titre de l'article */
.titre {
    color: #333;
    font-family: Poppins, sans-serif;
    font-size: 18px;
    font-weight: 700;
    line-height: 30px;
    letter-spacing: -0.6px;
}

/* Texte descriptif */
.texte-article p {
    color: #808080;
    font-family: Lato, sans-serif;
    font-size: 14px;
    line-height: 1.5;
}

/* 📱 Responsive - Tablette (max-width: 1024px) */
@media screen and (max-width: 1024px) {
    .articles-container {
        flex-direction: column; /* Passage en une seule colonne */
        align-items: center;
    }

    .column {
        width: 80%; /* Largeur plus adaptée pour tablette */
        max-width: 600px;
    }

    .article img {
        height: 300px; /* Réduction de la hauteur sur tablette */
    }
}

/* 📱 Responsive - Mobile (max-width: 768px) */
@media screen and (max-width: 768px) {
    .column {
        width: 90%; /* Ajustement de la largeur */
    }

    .article img {
        height: 250px;
    }
}

/* 📱 Responsive - Très petits mobiles (max-width: 480px) */
@media screen and (max-width: 480px) {
    .column {
        width: 100%; /* Prend toute la largeur sur petits écrans */
    }

    .article img {
        height: 220px; /* Ajustement hauteur */
    }

    .texte-article {
        padding: 15px;
    }
}
</style>
