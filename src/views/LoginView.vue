<script setup>
import { ref } from "vue";
import apiClient from "@/api/axios.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import { LoginFormSchema } from "@/utils/schema.js";

const email = ref("");
const password = ref("");
const error = ref(null);

const router = useRouter();
const authStore = useAuthStore();


const handleLogin = async () => {
  const payload = {
      email: email.value,
      password: password.value,
    }
  
  const loginFormResult = LoginFormSchema.safeParse(payload);
  if(!loginFormResult.success){
    error.value = loginFormResult.error.issues[0].message;
  }

  try {
    error.value = null;
    const response = await apiClient.post("/api/auth/login", payload);
    authStore.setToken(response.data.token);
    router.push("/");
  } catch (err) {
    console.error(err);
    error.value =
      err.response?.data?.error || "Login failed. Please try again.";
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Login</div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                />
              </div>
              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
            <p class="mt-3">
              Don't have an accout?
              <router-link to="/register">Register here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
