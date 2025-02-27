<template>
    <div class="auth-container">
        <h1>Inscription</h1>
        <form @submit.prevent="register">
            <input type="text" v-model="username" placeholder="Nom d'utilisateur" required>
            <input type="email" v-model="email" placeholder="Email" required>
            <input type="password" v-model="password" placeholder="Mot de passe" required>
            <input type="password" v-model="password_confirmation" placeholder="Confirmer le mot de passe" required>
            <button type="submit">S'inscrire</button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <p>Déjà un compte ? <router-link to="/login">Se connecter</router-link></p>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const username = ref('');
        const email = ref('');
        const password = ref('');
        const password_confirmation = ref('');
        const error = ref('');

        async function register() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username.value,  // 🔹 Correction ici (envoyer "username" et non "name")
                        email: email.value,
                        password: password.value,
                        password_confirmation: password_confirmation.value // 🔹 Ajout du champ de confirmation
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Erreur d'inscription");

                alert('Inscription réussie 🎉 Connectez-vous maintenant !');
                router.push({ name: 'Login' }); // Redirection vers la connexion
            } catch (error) {
                console.error("Erreur d'inscription :", error);
                error.value = error.message;
            }
        }

        return { username, email, password, password_confirmation, register, error };
    }
};
</script>

<style scoped>
.auth-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Aligner en haut */
    align-items: center;
    min-height: 100vh; /* Occuper toute la hauteur de l'écran */
    margin: 0 auto;
    text-align: center;
    padding-top: 5vh;
    border-radius: 10px;
    background: linear-gradient(135deg, #F0F1FF, #E3E4FF);
}

.auth-container h1 {
    color:#6066FA;
}


form {
    width: 100%;
    max-width: 450px;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
     /* Effet verre dépoli */
    backdrop-filter: blur(10px);
}

input, button {
    display: block;
    width: 95%;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    box-shadow: inset 0px 1px 4px rgba(0, 0, 0, 0.1);
}

/* 🔹 Amélioration des inputs */
input {
    background: #F9FAFF;
    border: 1px solid #ccc;
    transition: all 0.3s ease-in-out;
}

input:focus {
    border-color: #6066FA;
    outline: none;
    box-shadow: 0px 0px 8px rgba(96, 102, 250, 0.5);
}

/* 🔹 Amélioration des boutons */
button {
    background-color: #6066FA;
    color: white;
    font-weight: bold;
    cursor: pointer;
    margin-left: 10px;
    transition: transform 0.2s ease, background-color 0.3s ease;
}

button:hover {
    background-color: #F0F1FF;
    color: #6066FA;
    border:#6066FA 1px solid;
    transform: scale(1.05);
}

p {
    margin-top: 10px;
    gap: 10px;
}

a {
    color: #6066FA;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.2s ease;
}

a:hover {
    text-decoration: underline;
    color: #4A50E0;
}

.error {
    color: red;
}
</style>
