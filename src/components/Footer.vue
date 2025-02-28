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
                    <a href="src/svg/facebook.svg" target="_blank"><img class="icone" src="@/svg/ico-fb.svg"
                            alt="Facebook"></a>
                    <a href="src/svg/ico-twitter.svg" target="_blank"><img class="icone" src="@/svg/ico-twitter.svg"
                            alt="X"></a>
                    <a href="src/svg/ico-linkedin.svg" target="_blank"><img class="icone" src="@/svg/ico-linkedin.svg"
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
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: flex-end;
    /*padding: 20px;*/
    background-color: #f2f2f2;

}

.footer {
    display: flex;
    justify-content: flex-end;
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

#follow {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.follow {
    padding: 10px;
}

.icones {
    display: flex;
    justify-content: center;
    align-items: center;
}


.icone {
    width: auto;
    height: 25px;
    color: #333333;
    margin: 2px;
}

.icone:hover {
    color: #6066FA;
}

/* RESPONSIVE DESIGN */

/* Tablettes (ajuste les espacements et réduit la taille des icônes) */
@media screen and (max-width: 1024px) {
    footer {
        padding: 15px 5px;
    }

    .footer {
        text-align: center;
    }

    .logo-small {
        width: 70px; /* Réduction du logo */
    }

    .icones {
        gap: 5px;
    }

    .icone {
        width: 18px;
    }

    .navigation h3,
    .informations h3 {
        font-size: 13px;
    }

    .navigation p,
    .informations p {
        font-size: 11px;
    }
}

/* Mobiles : Footer en colonne pour éviter le dépassement */
@media screen and (max-width: 768px) {
    /* footer {
        padding: 10px 5px;
        font-size: 10px;
    }

    .logo-small {
        width: 60px;
    }

    .icones {
        gap: 4px;
    }

    .icone {
        width: 16px;
    }

    .navigation p,
    .informations p {
        font-size: 10px;
    } */
    .footer {
        flex-direction: row; /* Reste en ligne */
        justify-content: space-around; /* Espacement équilibré */
        align-items: center; /* Centre les éléments verticalement */
        width: 100%;
        flex-wrap: wrap; /* Permet le retour à la ligne si nécessaire */
        padding: 10px;
    }

    .logo-small {
        width: 55px; /* Légèrement réduit */
    }

    .navigation, 
    .informations, 
    .follow {
        text-align: center; /* Centre uniquement le texte */
        flex: 1; /* Permet une répartition équitable des éléments */
        min-width: 100px; /* Empêche les éléments de trop se rétrécir */
    }

    .navigation h3,
    .informations h3 {
        text-align: left;
    }
    .icones {
        display: flex;
        justify-content: center; /* Centre les icônes horizontalement */
        gap: 6px;
    }

    .icone {
        width: 14px;
    }
}

/* Très petits mobiles */
@media screen and (max-width: 480px) {
    footer {
        /* padding: 8px 3px;
        width: 100%; */
        padding: 5px;
        flex-wrap: wrap; /* Permet aux éléments de s'ajuster */
    }

    .logo-small {
        width: 45px;
    }

    .navigation, 
    .informations, 
    #follow {
        flex-basis: 30%; /* Ajuste la largeur pour ne pas trop serrer */
    }

    .icones {
        justify-content: center; /* Centre les icônes */
    }

    .icone {
        width: 12px;
    }
}

</style>