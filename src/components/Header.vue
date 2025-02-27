<template>
    <div id="logo">
        <img src="/src/svg/Logo.svg" alt="logo">
    </div>
    <header>
        <nav id="menu">
            <!-- Menu burger -->
            <div class="burger-menu" @click="toggleMenu">
                ☰
            </div>

            <div class="menu" :class="{ 'menu-open': isMenuOpen }">
                <!--  Home ? A VOIR -->
                <router-link to="/" exact class="menu-item">
                    <p :class="{ 'active': $route.path === '/' || $route.path === '/home' }">Accueil</p>
                </router-link>
                <router-link to="/articles" exact class="menu-item">
                    <p :class="{ 'active': $route.path === '/articles' }">Articles</p>
                </router-link>
                <router-link to="/contact" exact class="menu-item">
                    <p :class="{ 'active': $route.path === '/contact' }">Contact</p>
                </router-link>
                <router-link to="/cart" exact class="menu-item">
                    <p :class="{ 'active': $route.path === '/cart' }">Panier<span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span></p>
                </router-link>
                <!-- Affichage conditionnel des boutons en fonction de l'authentification -->
                <!-- <div class="auth-links">
                    <router-link to="/register" v-if="!isAuthenticated" class="menu-item">S'enregistrer</router-link>
                    <router-link to="/login" v-if="!isAuthenticated" class="menu-item">Se connecter</router-link>
                    <button @click="logout" v-if="isAuthenticated" class="logout-button">Déconnexion</button>
                    <router-link to="/dashboard" v-if="isAuthenticated" class="menu-item">Mon Profil</router-link>
                </div> -->
                <!-- Liens d'authentification améliorés -->
                <div class="auth-links">
                    <router-link to="/register" exact class="auth-item" :class="{ 'active-auth': $route.path === '/register' }">
                        S'enregistrer
                    </router-link>
                    <router-link to="/login" exact class="auth-item" :class="{ 'active-auth': $route.path === '/login' }">
                        Se connecter
                    </router-link>
                </div>
                
            </div>

        </nav>
    </header>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const cart = useCartStore();
        const totalItems = computed(() => cart.totalItems);
        const isMenuOpen = ref(false);

        function toggleMenu() {
            isMenuOpen.value = !isMenuOpen.value;
        }

        console.log("Total items in cart:", totalItems.value); // Debug log

        const router = useRouter();
        const isAuthenticated = ref(!!localStorage.getItem('token'));

        // Vérifier si un token est stocké
        function checkAuth() {
            isAuthenticated.value = !!localStorage.getItem('token');
        }

        function logout() {
            localStorage.removeItem('token'); // Supprime le token
            isAuthenticated.value = false;
            router.push({ name: 'Login' }); // Redirige vers la connexion
        }

        onMounted(checkAuth); // Vérifier l'authentification au montage du composant

        return {
            totalItems,
            isMenuOpen,
            toggleMenu,
            isAuthenticated,
            logout
        };

        
    }
}
</script>

<style scoped>
/* Styles correspondants */
/*body{
    width: 70%; /* Ajustez la largeur comme vous le souhaitez */
/*margin: 0 auto; /* Ajoutez cette ligne pour centrer le contenu horizontalement */
/* border: 1px solid #000;
    border-radius: 5px 5px 5px 5px;
    background: #FFFFFF;
    font-family: Poppins;
    padding: 20px; 
}*/

/* Logo */
#logo {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    margin-top: 10px;
}

#logo img {
    width: 21rem; /* Au lieu de 180px */
    height: auto;
}

/* Menu */
/* header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    width: 70%;
    margin: 0 auto;
}

#menu {
    display: flex;
    justify-content: center;
}

.menu {
    display: flex;
    justify-content: space-around;
    align-self: center;
    width: 46vw;
    height: 30px;
    margin-top: 50px;
    margin-bottom: 30px;
} */

/* HEADER */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    width: 100%;
    margin: 0 auto;
    max-width: 1200px;
}

/* MENU */
#menu {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-right: 50px;
    /* overflow: hidden; */
}

/* Menu normal sur écran large */
.menu {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    transition: 0.3s ease-in-out;
}

.menu-item {
    position: relative; /* Permet au badge de rester dans son conteneur */
    display: inline-block;
    margin: 0 30px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    color: black;
    padding: 8px 12px;
    border-radius: 5px;
    transition: color 0.3s ease;
}

.menu-item:hover {
    background-color: #F0F1FF;
    color: #6066FA;
}

/* COULEUR ACTIVE DES LIENS */
.active {
    color: #6066FA;
}

/* AUTHENTIFICATION */
.auth-links {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: auto;
}

.auth-item {
    text-decoration: none;
    font-weight: bold;
    font-size: 16px;
    color: black;
    padding: 8px 15px;
    
    border-radius: 5px;
    transition: 0.3s ease;
}

.auth-item:hover {
    background-color: #F0F1FF;
    color: #6066FA;
}

/* Couleur du lien actif */
.active-auth {
    color: #6066FA;
    font-weight: bold;
}

/* PANIER */
.cart-badge {
    background-color: #6066FA;
    color: white;
    border-radius: 50%;
    padding: 4px 8px;
    margin-left: 5px;
    font-size: 12px;
    position: absolute;
    top: -1px;
    right: -8px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 12px;
} 

/* MENU BURGER (TABLETTE ET MOBILE) */
.burger-menu {
    display: none;
    font-size: 24px;
    cursor: pointer;
    position: absolute;
    top: 25px;
    right: 20px;
    background: none;
    border: none;
    z-index: 1000;
    color:#6066FA;
}

/* Ajout d’un fond semi-transparent */
.menu-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
}

/* RESPONSIVE  */

/* TABLETTES & MOBILES (MENU BURGER) */
@media screen and (max-width: 1024px) {
    .burger-menu {
        display: block;
    }

    /* Cache le menu normal et active le burger */
    .menu {
        display: none;
        flex-direction: column;
        align-items: center;
        background-color: white;
        width: 85%;
        max-width: 320px;
        position: absolute;
        top: 80px;
        right: 7.5%;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        padding: 15px 0;
        z-index: 999;
        border-radius: 10px;
        transition: 0.3s ease-in-out;
    }

    .menu.menu-open {
        display: flex;
        background-color: white;
        width: 25%;
        height: auto;
        border:#6066FA 1px solid;
        background-color: #F0F1FF;
    }

    /* Ajustement des espacements */
    .menu-item {
        font-size: 16px;
        padding: 10px 0;
    }

    /* Ajustement des liens d'authentification */
    .auth-links {
        flex-direction: column;
        gap: 10px;
        align-items: center;
        margin-top: 10px;
        
    }

    /* Overlay activé avec le menu */
    .menu.menu-open + .menu-overlay {
        display: block;
    }
}

/* PETITS ÉCRANS */
@media screen and (max-width: 480px) {
    .burger-menu {
        font-size: 20px;
        top: 15px;
        right: 15px;
    }

    .menu-item {
        font-size: 14px;
    }

    .auth-item {
        font-size: 14px;
    }
}

</style>