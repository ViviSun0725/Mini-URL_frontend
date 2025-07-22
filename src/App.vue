<script setup>
import { ref } from "vue";

const isLoggedIn = ref(true); // This should be replaced with actual authentication logic
const handleLogout = () => {
  // Implement logout logic here
  isLoggedIn.value = false;
};
</script>

<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Mini URL</router-link>
        <div class="navbar-collapse collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Shorten URL</RouterLink>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <RouterLink class="nav-link" to="/my-urls">My URLs</RouterLink>
            </li>
          </ul>
        </div>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if="!isLoggedIn">
            <RouterLink class="nav-link" to="/login">Login</RouterLink>
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <RouterLink class="nav-link" to="/register">Register</RouterLink>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <a class="nav-link" href="#" @click.prevent="handleLogout"
              >Logout</a
            >
          </li>
        </ul>
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

@media (max-width: 768px) {
  .navbar .container-fluid {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
