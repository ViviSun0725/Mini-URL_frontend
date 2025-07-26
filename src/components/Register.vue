<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/api/axios.js";
import { RegisterFormSchema } from "@/utils/schema";

const email = ref("");
const password = ref("");
const error = ref(null);

const router = useRouter();

const handleRegister = async () => {
  const payload = {
    email: email.value,
    password: password.value,
  };

  const registerFormResult = RegisterFormSchema.safeParse(payload);
  if(!registerFormResult.success){
    error.value = registerFormResult.error.issues[0].message;
  }

  try {
    error.value = null;
    await apiClient.post("/api/auth/register", payload);
    router.push("/login");
  } catch (err) {
    error.value =
      err.response?.data?.error || "Registration failed. Please try again.";
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
              <button type="submit" class="btn btn-primary">Register</button>
            </form>
            <p class="mt-3">
              Already have an accout?
              <router-link to="/login">Login here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
