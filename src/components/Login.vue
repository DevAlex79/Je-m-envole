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
    justify-content: center;
    align-items: center;
    min-height: 100vh; /* Occuper toute la hauteur de l'écran */
    text-align: center;
}

.auth-container h1 {
    color:#6066FA;
}
form {
    width: 100%;
    max-width: 350px;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    margin-bottom: 20px;
}

input, button {
    width: 100%;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

button {
    background-color: #6066FA;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;
}

button:hover {
    background-color: #F0F1FF;
    color: #6066FA;
    border:#6066FA 1px solid;
}

p {
    margin-top: 10px;
}

a {
    color: #6066FA;
    text-decoration: none;
    font-weight: bold;
}

a:hover {
    text-decoration: underline;
}
</style>

