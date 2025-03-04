<template>
    <div>
        
        <!--Formulaire de contact-->
        <main>
            <div class="bottle">
                <img src="@/svg/Message Sent.svg" alt="bouteille-à-la-mer">
                <h1>Tu veux me parler ?</h1>
                <h2>Envoie-moi une bouteille</h2>
            </div>
            <div class="form">
                <form @submit.prevent="submitForm">
                    <div class="flex2Inputs">
                        <div class="flexLeftInp">
                            <input type="text" v-model="prenom" required maxlength="35" class="flexInp"
                                placeholder="Entrez votre prénom">
                        </div>
                        <div class="flexRightInp">
                            <input type="email" v-model="email" class="emailInp" required maxlength="50"
                                placeholder="Entrez votre email">
                        </div>
                    </div>
                    <textarea v-model="message" cols="50" rows="10" placeholder="Votre message..." required></textarea>
                    <button type="submit">Envoyer</button>
                </form>
                <transition name="fade">
                    <p v-if="successMessage" class="success">{{ successMessage }}</p>
                </transition>
                <transition name="fade">
                    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
                </transition>
            </div>
        </main>
        
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

import { ref } from 'vue';

export default {
    components: {
        Header,
        Footer
    },
    setup() {
        const prenom = ref('');
        const email = ref('');
        const message = ref('');
        const successMessage = ref('');
        const errorMessage = ref('');

        async function submitForm() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prenom: prenom.value,
                        email: email.value,
                        message: message.value
                    })
                });

                if (!response.ok) throw new Error("Erreur lors de l'envoi du message");

                const data = await response.json();
                successMessage.value = data.message;
                errorMessage.value = '';

                // Réinitialiser le formulaire après envoi
                prenom.value = '';
                email.value = '';
                message.value = '';

                // Masquer le message après 3 secondes
                setTimeout(() => {
                    successMessage.value = '';
                }, 3000);
            } catch (error) {
                errorMessage.value = "Erreur lors de l'envoi du message.";
                console.error(error);
            }
        }

        return {
            prenom,
            email,
            message,
            successMessage,
            errorMessage,
            submitForm
        };
    }
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
    width: 25.5rem;
    height: 20.5rem;
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
    margin: 0 auto 20px auto;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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

.flexInp::placeholder,
.emailInp::placeholder {
    color: #6066FA;
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
    border-radius: 60px;
    background-color: #F0F1FF;
    color: #6066FA;
    font-size: 17px;
    font-weight: bold;
}

button:hover {
    background: #FEE6E7;
    color: #FA5158;
    border:#FEE6E7 3px solid;
    font-weight: bold;
}

/* Animation de fondu */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.success, .error {
    font-weight: bold;
    text-align: center;
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.success {
    color: green;
    border:green 1px solid;
    background-color: #F0F1FF
}
.error {
    color: red;
    border:green 1px solid;
    background-color: #F0F1FF
}

</style>