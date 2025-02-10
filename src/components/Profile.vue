<template>
    <div class="profile-container">
        <h1>Mon Profil</h1>

        <!-- Affichage des infos utilisateur -->
        <p v-if="user">Bienvenue, <strong>{{ user.name }}</strong> !</p>
        <p v-else>Chargement des informations...</p>

        <!-- Bouton de déconnexion -->
        <button @click="logout">Déconnexion</button>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const user = ref(null);

        // Fonction pour récupérer l'utilisateur connecté
        async function fetchUser() {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Vous devez être connecté pour accéder à votre profil.");
                router.push({ name: 'Login' });
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error("Impossible de récupérer les informations.");

                const data = await response.json();
                user.value = data.user; // Stocker l'utilisateur dans user

            } catch (error) {
                alert(error.message);
                router.push({ name: 'Login' });
            }
        }

        // Fonction pour déconnecter l'utilisateur
        function logout() {
            localStorage.removeItem('token');
            router.push({ name: 'Login' });
        }

        onMounted(fetchUser); // Charger les infos au montage du composant

        return { user, logout };
    }
};
</script>

<style scoped>
.profile-container {
    text-align: center;
    margin: 20px;
}

button {
    background-color: red;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: darkred;
}
</style>
