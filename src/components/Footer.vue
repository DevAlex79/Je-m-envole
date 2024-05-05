<template>
    <footer>
        <div class="footer">
            <img class="logo-small" src="/src/svg/logo-small.svg" alt="petit logo">
            <div class="navigation">
                <h3>Navigation</h3>
                <p><router-link to="/">Accueil</router-link></p>
                <p><router-link to="/about">A propos</router-link></p>
                <p><router-link to="/contact">Contact</router-link></p>
            </div>
            <div class="informations">
                <h3>Informations</h3>
                <p>Mentions légales</p>
                <p>Politique de confidentialité</p>
            </div>
            <div id="follow">
                <div class="follow">
                    <h3>Suivez-moi</h3>
                </div>
                <div class="icones">
                    <a href="/src/svg/facebook.svg" target="_blank"><img class="icone" src="./src/svg/ico-fb.svg"
                            alt="Facebook"></a>
                    <a href="/src/svg/ico-twitter.svg" target="_blank"><img class="icone" src="./src/svg/ico-twitter.svg"
                            alt="Twitter"></a>
                    <a href="/src/svg/ico-linkedin.svg" target="_blank"><img class="icone" src="./src/svg/ico-linkedin.svg"
                            alt="LinkedIn"></a>
                </div>
            </div>
        </div>
    </footer>
    <!--Copyright-->
    <div id="copyright">
        <div class="copyright">
            <p>Copyright 2024</p>
            <p>Réalisation : Alexandra Masi</p>
        </div>
    </div>
</template>

<script>
export default {
    // Pas de logique spécifique pour ce composant dans cet exemple
}
</script>

<style scoped>

footer {
    width: 100%;
    padding: 20px;
    background-color: #f2f2f2;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.logo-small {
    width: 100px;
    height: auto;
}

.navigation,
.informations {
    margin-top: 20px;
}

.navigation h3,
.informations h3 {
    color: #333;
    font-size: 15px;
    font-weight: bold;
}

.navigation p,
.informations p {
    color: #808080;
    font-size: 13px;
}

.icones {
    display: flex;
}

.icone {
    width: 25px;
    height: 25px;
    margin: 2px;
}

.icone:hover {
    color: #6066FA;
}
</style>