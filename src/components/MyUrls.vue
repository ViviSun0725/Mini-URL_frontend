<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/api/axios.js";

const urls = ref([{
  originalUrl: "https://example.com",
  shortCode: "abc123",
  description: "Example URL",
  createdAt: new Date().toISOString(),
  isActive: true,
}]); // Placeholder for URLs, replace with actual data fetching logic
const loading = ref(false);
const error = ref(null);
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
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
            <div v-if="urls.length === 0 && !loading && !error" class="alert alert-info text-center">
              You havn't shortened any URLs yet.
            </div>
            <div v-if="urls.length > 0">
              <ul class="list-group">
                <li v-for="url in urls" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <p class="mb-1">
                      <a :href="url.originalUrl" target="_blank">{{ url.originalUrl }}</a>
                    </p>
                    <p class="mb-1">
                      Short URL: <a :href="`${baseUrl}/${url.shortCode}`" target="_blank">{{ `${baseUrl}/${url.shortCode}` }}</a>
                    </p>
                    <p v-if="url.description" class="mb-1 text-muted">Description: {{ url.description }}</p>
                    <p class="mb-1 text-muted">Active: {{ url.isActive ? "Yes" : "No" }}</p>
                    <p v-if="url.password" class="mb-1 text-muted">Password Protected: Yes</p>
                  </div>
                  <div class="button-group d-flex">
                    <button class="btn btn-sm btn-info me-2">Edit</button>
                    <button class="btn btn-sm btn-danger">Delete</button>
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
