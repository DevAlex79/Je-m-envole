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
                console.log("Réponse API:", data);

                if (!response.ok) throw new Error(data.message || "Erreur de connexion");

                if (!data.user) {
                    console.error("Aucune donnée utilisateur reçue:", data);
                    throw new Error("Les informations utilisateur sont incorrectes.");
                }

                // Adapter les clés retournées par l'API
                const userData = {
                    id_user: data.user.id,  // L'API retourne "id", donc on l'adapte
                    username: data.user.username, 
                    email: data.user.email,
                    Roles_id_role: data.user.role // L'API retourne "role" au lieu de "Roles_id_role"
                };

                console.log("Données utilisateur après correction:", userData);

                // Vérifier que les données sont bien présentes
                if (!userData.id_user || !userData.username) {
                    console.error("Données utilisateur incorrectes après correction:", userData);
                    throw new Error("Les informations utilisateur sont incorrectes.");
                }

                // Stocker correctement l'utilisateur et le token dans LocalStorage
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(userData));

                console.log("Utilisateur stocké dans LocalStorage:", localStorage.getItem('user'));

                alert('Connexion réussie 🎉');

                // Redirection selon le rôle
                if (userData.Roles_id_role === 3) {
                    router.push({ name: 'AdminDashboard' });
                } else if (userData.Roles_id_role === 2) {
                    router.push({ name: 'VendeurDashboard' });
                } else {
                    router.push({ name: 'UserDashboard' });
                }
            } catch (error) {
                alert(error.message);
            }
        }

        return { email, password, login };
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
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
     /* Effet verre dépoli */
    backdrop-filter: blur(10px);
}

h1 {
    margin-bottom: 20px;
}

input, button {
    display: block;
    width: 95%;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
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

/* Amélioration des boutons */
button {
    background-color: #6066FA;
    color: white;
    font-weight: bold;
    cursor: pointer;
    font-weight: bold;
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
</style>

