<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/api/axios.js";
import { useAuthStore } from "@/stores/auth.js";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);
const urls = ref([]);
const filteredUrls = ref([]);
const searchQuery = ref("");
const loading = ref(false);
const error = ref(null);
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

onMounted(async () => {
  if (!isLoggedIn) {
    router.push("/login");
    return;
  }
  await fetchUrls();
});

const fetchUrls = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiClient.get("/api/urls/my-urls");
    urls.value = response.data;
    filterUrls();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to fetch URLs.";
  } finally {
    loading.value = false;
  }
};

const filterUrls = () => {
  const query = searchQuery.value.toLowerCase();
  filteredUrls.value = urls.value.filter(
    (url) =>
      url.originalUrl.toLowerCase().includes(query) ||
      url.shortCode.toLowerCase().includes(query) ||
      (url.description && url.description.toLowerCase().includes(query))
  );
};

const deleteUrl = async (id) => {
  if (confirm("Are you sure you want to delete this URL?")) {
    try {
      await apiClient.delete(`/api/urls/${id}`);
      const index = urls.value.findIndex((url) => url.id === id);
      if (index !== -1) {
        urls.value.splice(index, 1);
      }
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to delete URL.";
    }
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header text-center">
            <h1>My URLs</h1>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">Loading URLs...</div>
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div
              v-if="urls.length === 0 && !loading && !error"
              class="alert alert-info text-center"
            >
              You havn't shortened any URLs yet.
            </div>
            <div v-if="urls.length > 0">
              <div class="mb-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search URLs..."
                  v-model="searchQuery"
                  @input="filterUrls"
                />
              </div>
              <ul class="list-group">
                <li
                  v-for="url in filteredUrls"
                  :key="url.id"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <p class="mb-1">
                      <a :href="url.originalUrl" target="_blank">{{
                        url.originalUrl
                      }}</a>
                    </p>
                    <p class="mb-1">
                      Short URL:
                      <a
                        :href="`${baseUrl}/${url.shortCode}`"
                        target="_blank"
                        >{{ `${baseUrl}/${url.shortCode}` }}</a
                      >
                    </p>
                    <p v-if="url.description" class="mb-1 text-muted">
                      Description: {{ url.description }}
                    </p>
                    <p class="mb-1 text-muted">
                      Active: {{ url.isActive ? "Yes" : "No" }}
                    </p>
                    <p v-if="url.requiresPassword" class="mb-1 text-muted">
                      Password Protected: Yes
                    </p>
                  </div>
                  <div class="button-group d-flex">
                    <button class="btn btn-sm btn-info me-2">Edit</button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="deleteUrl(url.id)"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
