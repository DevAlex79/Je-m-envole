<template>
    <div>
        <Header />

        <!--Formulaire de contact-->
        <main>
            <div class="bottle">
                <img src="@/svg/Message Sent.svg" alt="bouteille-à-la-mer">
                <h1>Tu veux me parler ?</h1>
                <h2>Envoie-moi une bouteille</h2>
            </div>
            <div class="form">
                <form>
                    <div class="flex2Inputs">
                        <div class="flexLeftInp">
                            <input type="text" name="prenom" id="prenom" required maxlength="35" class="flexInp"
                                placeholder="Entrez votre prénom">
                        </div>
                        <div class="flexRightInp">
                            <input type="email" name="email" id="email" class="emailInp" required maxlength="50"
                                placeholder="Entrez votre email">
                        </div>
                    </div>
                    <textarea name="txt" id="txtArea" cols="50" rows="10"></textarea>
                    <button>Envoyer</button>
                </form>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
    // Logique JavaScript ici si nécessaire
};
</script>

<style scoped>
/* Styles CSS */
.bottle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 900;
    font-family: Lato;
}

img {
    margin-top: 0;
    margin-bottom: 0;
    width: 21.5rem;
    height: 12.5rem;
}

h1 {
    margin-top: 0;
    margin-bottom: 0;
}

h2 {
    font-size: larger;
    margin-top: 0;
    color: #6066FA;
}

.active .contact {
    color: #6066FA;
}

.form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 60%;
    height: 600px;
    background: #6066FA;
    border-radius: 5px;
    margin: 0 auto;
}

.flex2Inputs {
    display: block;
    justify-content: space-between;
    width: 95%;
    margin: 0 auto;
}

.flexInp,
.emailInp {
    margin: 20px auto;
    outline: 0;
    background: #f1f1f1;
    width: 90%;
    border: 0;
    padding: 15px;
    font-size: 14px;
    border-radius: 3px;
}

.flexLeftInp,
.flexRightInp {
    flex-basis: 45%;
}

textarea {
    display: block;
    margin: 20px auto;
    outline: 0;
    background: #f1f1f1;
    width: 95%;
    border: 0;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
    border-radius: 3px;
}

button {
    width: 45%;
    display: block;
    margin: 45px auto 0 auto;
    outline: none;
    border: 0;
    height: 50px;
    transition: all 0.2s linear;
    cursor: pointer;
    border-radius: 5px;
    font-size: 17px;
}

button:hover {
    background: #FEE6E7;
}
</style>