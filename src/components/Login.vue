<template>
    <div class="auth-container">
        <h1>Connexion</h1>
        <form @submit.prevent="login">
            <input type="email" v-model="email" placeholder="Email" required>
            <input type="password" v-model="password" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
        </form>
        <p>Pas encore inscrit ? <router-link to="/register">Créer un compte</router-link></p>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const email = ref('');
        const password = ref('');

        async function login() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email.value,
                        password: password.value
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Erreur de connexion");

                localStorage.setItem('token', data.token); // Stocker le token
                alert('Connexion réussie 🎉');
                router.push({ name: 'Articles' }); // Rediriger vers les articles
            } catch (error) {
                alert(error.message);
            }
        }

        return { email, password, login };
    }
};
</script>
