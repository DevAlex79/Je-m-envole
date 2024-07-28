<template>
    <div id="logo">
        <img src="/src/svg/Logo.svg" alt="logo">
    </div>
    <header>
        <nav id="menu">
            <div class="menu">
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
            </div>
        </nav>
    </header>
</template>

<script>
import { computed } from 'vue';
import { useCartStore } from '@/store/cartStore';

export default {
    setup() {
        const cart = useCartStore();
        const totalItems = computed(() => cart.totalItems);

        console.log("Total items in cart:", totalItems.value); // Debug log

        return {
            totalItems
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
    flex-shrink: 0;
}

#logo img {
    width: 21rem;
    height: auto;
}

/* Menu */
header {
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
}

.menu p {
    margin: 0 15px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
}

#menu,
p {
    display: flex;
    align-items: center;
    color: #000000;
    font-size: 14px;
    font-style: normal;
    font-weight: bold;
    line-height: normal;
    letter-spacing: -0.42px;
}

.menu-item {
    margin: 0 15px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
}

.cart-badge {
    /*background-color: red;*/
    background-color: #6066FA;
    color: white;
    border-radius: 50%;
    padding: 5px 10px;
    margin-left: 5px;
    font-size: 12px;
    position: absolute;
    top: -10px;
    right: -10px;
}

.active {
    color: #6066FA;
}
</style>