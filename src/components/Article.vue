<template>
    <main id="articles">
        <article v-for="(article, index) in articles" :key="index">
            <div class="article">
                <div class="image">
                    <a :href="'singlearticle.html?id=' + article.id" target="_blank"><img :src="article.image" :alt="article.alt"></a>
                    <div class="texte-article">
                        <a :href="'singlearticle.html?id=' + article.id" target="_blank">
                            <h2 class="categorie">{{ article.category }}</h2>
                        </a>
                        <h1 class="titre">{{ article.title }}</h1>
                        <p>{{ article.description }}</p>
                    </div>
                </div>
            </div>
        </article>
    </main>
</template>

<script>
export default {
    name: 'Article',
    props: {
        articles: Array
    }
}

document.addEventListener('DOMContentLoaded', function () {
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
                // Afficher les détails de l'article dans votre page HTML
                const articleDetailsContainer = document.getElementById('articleDetails');
                articleDetailsContainer.innerHTML = `
                    <div class="image">
                        <img src="${articleDetails.image}" alt="${articleDetails.title}">
                    </div>
                    <div class="texte-article">
                        <h2 class="categorie-${articleDetails.category.toLowerCase()}">${articleDetails.category}</h2>
                        <h1 class="titre">${articleDetails.title}</h1>
                        <p>${articleDetails.description}</p>
                    </div>
                `;
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des données de l\'article:', error));
});
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

</style>
