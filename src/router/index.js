import { createRouter, createWebHistory } from 'vue-router'; // Importez les fonctions nécessaires
import { useUserStore } from "@/store/userStore";
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
import AdminDashboard from '@/components/AdminDashboard.vue';
import VendeurDashboard from '@/components/VendeurDashboard.vue';
import UserDashboard from '@/components/UserDashboard.vue';

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

    // Dashboard selon le rôle
    { 
        path: "/admin", 
        name: "AdminDashboard", 
        component: AdminDashboard, 
        meta: { requiresAuth: true, role: "admin" } 
    },

    { 
        path: "/vendeur", 
        name: "VendeurDashboard", 
        component: VendeurDashboard, 
        meta: { requiresAuth: true, role: "vendeur" } 
    },

    { 
        path: "/user", 
        name: "UserDashboard", 
        component: UserDashboard, meta: { requiresAuth: true, role: "user" } 
    },

    // Ajout d'autres routes si nécessaire
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem('token');

//     if (to.name === 'Checkout' && !token) {
//         alert("Vous devez être connecté pour valider votre panier.");
//         next({ name: 'Login' });
//     } else {
//         next();
//     }
// });
// Middleware pour la redirection après login
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // 🔥 Récupération du rôle

    if (to.name === 'Checkout' && !token) {
        alert("Vous devez être connecté pour valider votre panier.");
        return next({ name: 'Login' });
    }

    if (to.name === 'Login' && token) {
        // Redirection après connexion selon le rôle
        if (userRole === 'admin') return next({ name: 'AdminDashboard' });
        if (userRole === 'vendeur') return next({ name: 'VendeurDashboard' });
        return next({ name: 'UserDashboard' });
    }

    next();
});


export default router;
