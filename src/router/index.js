import { createRouter, createWebHistory } from 'vue-router'; // Importez les fonctions nécessaires

import Home from '@/Home.vue';
import Articles from '@/components/Articles.vue';
//import Article from '@/components/Article.vue'; = SINGLE ARTICLE
import SingleArticle from '@/components/SingleArticle.vue';
import Contact from '@/components/Contact.vue';
import Cart from '@/components/Cart.vue';
import Checkout from '@/components/Checkout.vue';
import Register from '@/components/Register.vue';
import Login from '@/components/Login.vue';
import Profile from '@/components/Profile.vue';

const routes = [

    {
        path: "/",
        name: "Accueil",
        component: Home,
    },
    {
        path: "/article/:id", // Ajout d'un paramètre dynamique pour l'identifiant de l'article
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
    {
        path: "/cart",
        name: "Cart",
        component: Cart,
    },

    {
        path: "/checkout",
        name: "Checkout",
        component: Checkout,
    },

    {
        path: "/register",
        name: "Register",
        component: Register,
    },
    
    {
        path: "/login",
        name: "Login",
        component: Login,
    },

    {
        path: "/profile",
        name: "Profile",
        component: Profile,
    },

    // Ajout d'autres routes si nécessaire
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.name === 'Checkout' && !token) {
        alert("Vous devez être connecté pour valider votre panier.");
        next({ name: 'Login' });
    } else {
        next();
    }
});



export default router;
