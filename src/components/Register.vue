<template>
    <div class="auth-container">
        <h1>Inscription</h1>
        <form @submit.prevent="register">
            <input type="text" v-model="name" placeholder="Nom" required>
            <input type="email" v-model="email" placeholder="Email" required>
            <input type="password" v-model="password" placeholder="Mot de passe" required>
            <button type="submit">S'inscrire</button>
        </form>
        <p>Déjà un compte ? <router-link to="/login">Se connecter</router-link></p>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const name = ref('');
        const email = ref('');
        const password = ref('');

        async function register() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name.value,
                        email: email.value,
                        password: password.value
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Erreur d'inscription");

                alert('Inscription réussie 🎉 Connectez-vous maintenant !');
                router.push({ name: 'Login' }); // Redirection vers la connexion
            } catch (error) {
                alert(error.message);
            }
        }

        return { name, email, password, register };
    }
};
</script>

<style scoped>
.auth-container {
    width: 30%;
    margin: 0 auto;
    text-align: center;
}
input, button {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 10px;
}
button {
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
}
button:hover {
    background-color: #218838;
}
</style>
