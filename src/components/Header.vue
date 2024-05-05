<template>
    <div id="logo">
            <img src="/src/svg/Logo.svg" alt="logo">
        </div>
    <header>
        <div id="menu">
            <div class="menu">
                <!--  Home ? A VOIR -->
                <router-link to="/" class="active"> 
                    <p class="principal">Accueil</p>
                </router-link> 
                <!--  Home ? A VOIR
                <router-link to="/home" class="active">
                    <p class="principal">Accueil</p>
                </router-link>  -->
                <router-link to="/articles">
                    <p class="about">Articles</p>
                </router-link>
                <router-link to="/contact">
                    <p class="contact">Contact</p>
                </router-link>
                <router-link to="/checkout">
                    <p class="checkout">Panier</p>
                </router-link>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    // Pas de logique spécifique pour ce composant dans ce cas
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
#logo{
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
}

#menu{
    display: flex;
    justify-content: center;
}

.menu{
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
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.active .principal {
    color: #6066FA;
}

</style>