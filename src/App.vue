<template>
  <!--<div>-->
  <Header />

  <router-view></router-view>

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
</style>
