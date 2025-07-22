import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("token") || null);

    const isLoggedIn = computed(() => !!token.value);

    function setToken(newToken) {
        token.value = newToken;
        if(newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
    }

    function logout() {
        setToken(null);
    }

    return {
        token,
        isLoggedIn,
        setToken,
        logout
    };
})