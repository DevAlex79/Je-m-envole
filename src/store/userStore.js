import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
    const user = ref(JSON.parse(localStorage.getItem("user")) || null);

    const isAdmin = computed(() => user.value?.role === 3);
    const isVendeur = computed(() => user.value?.role === 2);
    const isUser = computed(() => user.value?.role === 1);

    function setUser(newUser) {
        user.value = newUser;
        localStorage.setItem("user", JSON.stringify(newUser));
    }

    function logout() {
        user.value = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    return { user, isAdmin, isVendeur, isUser, setUser, logout };
});
