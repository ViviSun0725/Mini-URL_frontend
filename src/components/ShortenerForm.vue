<script setup>
import * as z from "zod";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import apiClient from "@/api/axios.js";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";

const originalUrl = ref("");
const customShortCode = ref("");
const password = ref("");
const description = ref("");
const isActive = ref(true);
const shortUrl = ref("");
const error = ref(null);

const authStore = useAuthStore();

const { isLoggedIn } = storeToRefs(authStore);

const ShortenerFormSchema = z.object({
  originalUrl: z.url(
    { protocol: /^https?$/ },
    { error: "URL must start with http or https" }
  ),
  customShortCode: z
    .string()
    .min(6, {
      error: "Custom short code must be between 6 and 20 characters long",
    })
    .max(20, {
      error: "Custom short code must be between 6 and 20 characters long",
    })
    .regex(/^[A-Za-z\d]{6,20}$/, {
      error: "Custom short code may only contain letter sand numbers",
    })
    .optional(),
  password: z
    .string()
    .min(6, { error: "Password must be between 6 and 20 characters long" })
    .max(20, { error: "Password must be between 6 and 20 characters long" })
    .regex(/^[A-Za-z\d!@#$%^&*]{6,20}$/, {
      error:
        "Password may only contain letters, numbers, and may only contain the following special characters: !@#$%^&*",
    })
    .optional(),
  description: z
    .string()
    .max(300, { error: "Please keep the description under 300 characters." })
    .optional(),
  isActive: z.boolean(),
});

watch(originalUrl, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    shortUrl.value = "";
    error.value = null;
  }
});

const shortenUrl = async () => {
  shortUrl.value = "";
  error.value = null;

  const payload = {
    originalUrl: originalUrl.value,
    customShortCode: customShortCode.value || undefined,
    password: password.value || undefined,
    description: description.value || undefined,
    isActive: isActive.value,
  };

  const ShortenerFormResult = ShortenerFormSchema.safeParse(payload);
  if (!ShortenerFormResult.success) {
    error.value = userInputResult.error.issues[0].message;
    return;
  }
  try {
    const response = await apiClient.post("/api/urls/shorten", payload);
    shortUrl.value = response.data.shortUrl;
  } catch (err) {
    error.value =
      err.response?.data?.error ||
      "An error occurred while shortening the URL.";
  }
};

const getPageDetails = async () => {
  error.value = "";
  if (!originalUrl.value) {
    error.value = "Please enter an Original URL first.";
    return;
  }
  try {
    const response = await apiClient.get(
      `/api/page/page-details?url=${encodeURIComponent(originalUrl.value)}`
    );
    const { title, description: pageDescription } = response.data;
    description.value = title || pageDescription || "";
  } catch (err) {
    error.value = "Could not fetch page details. Please check the URL.";
  }
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(shortUrl.value).then(() => {
    alert("Copied to clipboard!");
  });
};
</script>
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h1>URL Shortener</h1>
          </div>
          <div class="card-body">
            <div v-if="!isLoggedIn" class="alert alert-warning text-center">
              Please <router-link to="/login">log in</router-link> or
              <router-link to="/register">register</router-link> to use the URL
              shortener.
            </div>
            <form v-else @submit.prevent="handleShortenUrl">
              <div class="mb-3">
                <label for="originalUrl" class="form-label">OrinialUrl</label>
                <input
                  type="url"
                  class="form-control"
                  id="originalUrl"
                  placeholder="Enter long URL"
                  v-model="originalUrl"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="customShortCode" class="form-label"
                  >Custom Short Code (Optional)</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="customShortCode"
                  placeholder="Enter custom short code"
                  v-model="customShortCode"
                  autocomplete="off"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label"
                  >Password(Optional)</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Enter password for short URL"
                  v-model="password"
                  autocomplete="off"
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label"
                  >Description (Optional)</label
                >
                <div class="input-group">
                  <textarea
                    class="form-control"
                    id="description"
                    v-model="description"
                    rows="3"
                  ></textarea>
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="getPageDetails"
                  >
                    Get Page Details
                  </button>
                </div>
              </div>
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="isActive"
                  v-model="isActive"
                />
                <label class="form-check-label" for="isActive"> Active </label>
              </div>

              <button
                class="btn btn-primary w-100"
                type="submit"
                @click.prevent="shortenUrl"
              >
                Shorten
              </button>
            </form>
            <div v-if="shortUrl" class="alert alert-success mt-3">
              <p class="mb-0">
                Short URL:
                <a :href="shortUrl" target="_blank">{{ shortUrl }}</a>
              </p>
              <button
                class="btn btn-sm btn-secondary mt-2"
                @click="copyToClipboard"
              >
                Copy
              </button>
            </div>
            <div v-if="error" class="alert alert-danger mt-3">
              <p class="mb-0">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #007bff;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
