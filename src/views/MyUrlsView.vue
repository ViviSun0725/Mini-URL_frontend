<script setup>
import { ref, onMounted, reactive } from "vue";
import apiClient from "@/api/axios.js";
import { Modal } from "bootstrap";
import { useAuthStore } from "@/stores/auth.js";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { editFormSchema } from "@/utils/schema.js"

const router = useRouter();
const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);

const urls = ref([]);
const filteredUrls = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref("");
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const editModal = ref(null);
const modalError = ref(null);
const currentUrl = reactive({});
const usePassword = ref(false);
const initialPasswordExists = ref(false);
const initialIsActive = ref(true);

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

const editUrl = (url) => {
  // modal initialization
  Object.assign(currentUrl, { ...url, password: "" });

  initialPasswordExists.value = url.requiresPassword;
  usePassword.value = initialPasswordExists.value;
  initialIsActive.value = url.isActive;
  modalError.value = null;

  const modalElement = document.getElementById("editUrlModal");
  if (modalElement) {
    editModal.value = new Modal(modalElement);
    modalElement.addEventListener("hidden.bs.modal", () => {
      modalError.value = null;
    });
  }
  if (editModal.value) {
    editModal.value.show();
  }
};

const saveUrl = async () => {
  modalError.value = null;
  try {
    const isDeactivating = initialIsActive.value && !currentUrl.isActive;
    if (isDeactivating) {
      const confirmed = confirm(
        "Deactivating this link will make it unusable. Are you sure you want to continue?"
      );
      // Revert to active state if the user cancels the confirmation
      if (!confirmed) {
        currentUrl.isActive = true;
        return;
      }
    }

    const payload = {
      originalUrl: currentUrl.originalUrl,
      description: currentUrl.description,
      isActive: currentUrl.isActive,
    };
    if (usePassword.value) {
      // If "Password Protect Link" is checked
      const hasNewPassword = !!currentUrl.password;
      if (hasNewPassword) {
        // TODO: enhance validation
        if (currentUrl.password.length < 6) {
          modalError.value = "Password must be at least 6 characters long.";
          return;
        }
        payload.password = currentUrl.password;
      } else if (initialPasswordExists.value) {
        // If checkbox is checked, but no new password is provided for an existing protected link
        const keepOld = confirm(
          "you have not entered a new password. The existing password will be kept. Do you want to continue?"
        );
        if (!keepOld) return;
      } else {
        alert("Please enter a password");
        return
      }
    } else {
      // If "Password Protect Link" is unchecked
      if (initialPasswordExists.value) {
        const confirmRemove = confirm(
          "Unchecking this box will remove the password from this link. Are you sure you want to continue?"
        );
        if (!confirmRemove) {
          usePassword.value = true; // revert checkbox
          return;
        }
      }
      payload.password = null;
    }

    const payloadResult = editFormSchema.safeParse(payload);
    if(!payloadResult.success){
      modalError.value = payloadResult.error.issues[0].message;
      return;
    }

    await apiClient.put(`/api/urls/${currentUrl.id}`, payload);
    editModal.value.hide();
    await fetchUrls();
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      modalError.value = err.response.data.errors.map((e) => e.msg).join(", ");
    } else {
      modalError.value = err.response?.data?.error || "Failed to save URL.";
    }
  }
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
                    <button
                      class="btn btn-sm btn-info me-2"
                      @click="editUrl(url)"
                    >
                      Edit
                    </button>
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
            <!-- Edit Modal -->
            <div
              class="modal fade"
              id="editUrlModal"
              tabindex="-1"
              aria-labelledby="editUrlModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="editorUrlModalLabel">
                      Edit URL
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div v-if="modalError" class="alert alert-danger">
                      {{ modalError }}
                    </div>
                    <form @submit.prevent="saveUrl">
                      <div class="mb-3">
                        <label for="editOriginalUrl" class="form-label"
                          >Original Url</label
                        >
                        <input
                          type="url"
                          class="form-control"
                          id="editOriginalUrl"
                          v-model="currentUrl.originalUrl"
                          required
                        />
                      </div>
                      <div class="mb-3">
                        <label for="editDescription" class="form-label"
                          >Description</label
                        >
                        <textarea
                          class="form-control"
                          id="editDescription"
                          v-model="currentUrl.description"
                        ></textarea>
                      </div>
                      <div class="mb-3 form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="editIsActive"
                          v-model="currentUrl.isActive"
                        />
                        <label class="form-check-label" for="editIsActive"
                          >Active</label
                        >
                      </div>
                      <div class="mb-3 form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="usePassword"
                          v-model="usePassword"
                        />
                        <label class="form-check-label" for="usePassword"
                          >Password Protected Link</label
                        >
                      </div>
                      <div class="mb-3">
                        <label for="editPassword" class="form-label"
                          >New Password</label
                        >
                        <input
                          type="password"
                          class="form-control"
                          id="editPassword"
                          v-model="currentUrl.password"
                          :disabled="!usePassword"
                        />
                      </div>
                      <button type="submit" class="btn btn-primary">
                        Save changes
                      </button>
                    </form>
                  </div>
                </div>
              </div>
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

@media (max-width: 768px) {
  .list-group-item {
    flex-wrap: wrap;
  }

  .list-group-item > div:first-child {
    flex-basis: 100%;
    margin-bottom: 10px;
  }

  .button-group {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
