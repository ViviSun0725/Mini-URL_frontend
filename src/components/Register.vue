<script setup>
  import * as z from "zod";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import apiClient from "@/api/axios.js";

  const email = ref("");
  const password = ref("");
  const error = ref(null);

  const router = useRouter();

  const EmailSchema = z.email("Please enter a valid email address");
  const PasswordSchema = z.string().min(6, {error: "Password must be between 6 and 20 characters long"}).max(20,{error: "Password must be between 6 and 20 characters long"}).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,20}$/,{error: "Password must include at least one letter and one number, and may only contain special characters: !@#$%^&*"});

  const handleRegister = async () => {
    const emailResult = EmailSchema.safeParse(email.value);
    if (!emailResult.success) {
      error.value = emailResult.error.issues[0].message
      return
    }
    const passwordResult = PasswordSchema.safeParse(password.value);
    if (!passwordResult.success) {
      error.value = passwordResult.error.issues[0].message
      return
    }
    
    try {
      error.value = null;
      await apiClient.post("/api/auth/register", {
        email: email.value,
        password: password.value,
      });
      router.push("/login");
    } catch (err) {
      error.value = err.response?.data?.error || "Registration failed. Please try again.";
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
