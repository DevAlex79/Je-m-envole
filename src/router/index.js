import { createRouter, createWebHistory } from 'vue-router'; // Importez les fonctions nécessaires

import Home from '@/Home.vue';
import Articles from '@/components/Articles.vue';
//import Article from '@/components/Article.vue'; = SINGLE ARTICLE
import SingleArticle from '@/components/SingleArticle.vue';
import Contact from '@/components/Contact.vue';

const routes = [

    {
        path: "/",
        name: "Accueil",
        component: Home,
    },
    {
        path: "/article/:id", // Ajout un paramètre dynamique pour l'identifiant de l'article
        name: "SingleArticle", // Nom de la route
        component: SingleArticle, // Utilisation du composant Article pour cette route
        props: true // Active la transmission des paramètres en tant que propriétés
    },
    {
        path: "/articles",
        name: "Articles",
        component: Articles,
    },
    {
        path: "/contact",
        name: "Contact",
        component: Contact,
    },
    // {
    //     path: "/checkout",
    //     name: "Checkout",
    //     component: Checkout,
    // },

    // Ajout d'autres routes si nécessaire
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
