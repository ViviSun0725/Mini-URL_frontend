<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/api/axios.js";

const loading = ref(true);
const requiresPassword = ref(false);
const description = ref("");
const passwordInput = ref("");
const originalUrl = ref("");
const error = ref("");

const route = useRoute();

const resolveShortUrl = async () => {
  loading.value = true;
  error.value = "";
  requiresPassword.value = false;
  originalUrl.value = "";
  const shortCode = route.params.shortCode;
  try {
    const response = await apiClient.get(`/api/urls/url-details/${shortCode}`);
    const data = response.data;

    if (data.requiresPassword) {
      requiresPassword.value = true;
      description.value = data.description;
    } else {
      originalUrl.value = data.originalUrl;
      description.value = data.description;
    }
  } catch (err) {
    console.error("Error fetching URL details:", err);
    error.value =
      err.response?.data?.error ||
      "An error occurred while fetching URL details.";
  } finally {
    loading.value = false;
  }
};

const verifyPassword = async () => {
  error.value = "";
  const shortCode = route.params.shortCode;
  try {
    const response = await apiClient.post(`/api/urls/verify-password`, {
      shortCode: shortCode,
      password: passwordInput.value,
    });
    originalUrl.value = response.data.originalUrl;
    description.value = response.data.description;
    requiresPassword.value = false;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = "Incorrect password.";
    } else {
      error.value = "An error occurred during password verification.";
    }
  }
};

const proceedToLink = () => {
  window.location.href = originalUrl.value;
}
onMounted(async () => {
  await resolveShortUrl();
});
</script>
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body test-center">
            <h2 v-if="loading">Loading...</h2>
            <div v-if="error" class="alert alert-danger">
              <p>{{ error }}</p>
            </div>
            <div v-if="requiresPassword">
              <h3>This link is password protected.</h3>
              <p v-if="description">Description: {{ description }}</p>
              <form @submit.prevent="verifyPassword">
                <div class="mb-3">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Enter password"
                    v-model="passwordInput"
                    required
                  />
                </div>
                <button class="btn btn-primary" type="submit">
                  Unlock Link
                </button>
              </form>
            </div>
            <div v-if="originalUrl && !requiresPassword && !loading && !error">
              <h3>Your are about to be redirected:</h3>
              <p>
                Original URL:
                <a :href="originalUrl" target="_blank">{{ originalUrl }}</a>
              </p>
              <p v-if="description">Descriptoin {{ description }}</p>
              <button class="btn btn-success" @click="proceedToLink">
                Proceed to Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
