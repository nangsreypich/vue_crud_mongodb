<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="/">
        <img src="../public/assets/images/logo.jpg" alt="Logo" height="40" class="me-2"/>
        <span>MyApp</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contact">Contact</router-link>
          </li>
        </ul>
        <!-- <div class="d-flex ms-3">
          <router-link class="btn btn-primary me-2" to="/login">Login</router-link>
        </div> -->
      </div>
    </div>
  </nav>
  <router-view/>
</template>

<style scoped>
.nav-link.router-link-exact-active {
  color: #034da1 !important;
  font-weight: bold;
}
</style>
