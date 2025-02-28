<template>
  <!--<div>-->
  <Header />

  <!--<router-view></router-view>-->

  <div id="app">
        <router-view />
        <div v-if="notification.show" :class="['notification', notification.type]">
            {{ notification.message }}
        </div>
    </div>

  <Footer />

  <!--</div>-->
</template>

<script>
import Home from './Home.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
//import Article from './components/Article.vue'
import Articles from './components/Articles.vue'
import SingleArticle from './components/SingleArticle.vue'
import Contact from './components/Contact.vue'
import Cart from './components/Cart.vue'
//import { useCartStore } from './store/cartStore'
import { useNotificationStore } from '@/store/notificationStore';


export default {
  name: 'App',
  components: {
    Home,
    Header,
    //Article,
    Articles,
    SingleArticle,
    Contact,
    Cart,
    Footer
  },
  /*mounted() {
    // Initialisez l'expédition lorsque le composant est monté
    useCartStore().initShipment();
  },*/
  computed: {
        notification() {
            return useNotificationStore();
        },
    },
}
</script>

<style>
/* styles CSS globaux si nécessaire */
/*#app {
  width: 70%;
  margin: 0 auto;
  /* Ajoutez cette ligne pour centrer le contenu horizontalement */
/*border: 1px solid #000;
  border-radius: 5px 5px 5px 5px;
  background: #FFFFFF;
  font-family: Poppins;
  padding: 20px;
}*/

body {
  width: 70%;
  /* Ajuste la largeur */
  margin: 0 auto;
  /* Centre le contenu horizontalement */
  border: 1px solid #000;
  border-bottom: #000 2px solid;
  border-radius: 5px 5px 5px 5px;
  background: #FFFFFF;
  font-family: Poppins;
  padding: 20px;
}

#logo {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

header {
  display: flex;
  justify-content: space-between;
  /* Ajuste la disposition pour mettre le logo et le menu à chaque extrémité */
  align-items: center;
  /* Centre verticalement le contenu */
  padding: 20px;
  /* Ajoute un espacement autour du contenu */
}

#menu {
  display: flex;
  justify-content: center;
  /*gap: 20px;*/
  /* Espacement entre les éléments du menu */
}

.notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    background-color: #44D382;
    color: #fff;
}

.notification.success {
    /*background-color: #44D382;*/
    background-color: #6066FA;
}

.notification.error {
    background-color: #FA5158;
}

.notification.info {
    background-color: #56CFE1;
}

.notification.warning {
    background-color: #F39E30;
}
</style>
