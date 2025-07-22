<script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import apiClient from "@/api/axios.js";

  const email = ref("");
  const password = ref("");
  const error = ref(null);

  const router = useRouter();

  const handleRegister = async () => {
    try {
      error.value = null;
      await apiClient.post("/api/auth/register", {
        email: email.value,
        password: password.value,
      });
      router.push("/login");
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.message || "Registration failed. Please try again.";
      console.error("Registration error:", error.value);
    }
  };
</script>
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Register</div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
              </div>
              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              <button type="submit" class="btn btn-primary">Register</button>
            </form>
            <p class="mt-3">Already have an accout? <router-link to="/login">Login here</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
