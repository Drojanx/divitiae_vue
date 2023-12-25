<template>
    <div>
      <nav class="navbar navbar-dark">
        <div class="container-fluid">
          <router-link to="/" class="navbar-brand my-auto px-4 rounded" v-if="!user"><img src="@/assets/Divitiae-1.png" id="navLogo">Divitiae</router-link>
          <router-link to="/home" class="navbar-brand my-auto px-4 rounded" v-if="user"><img src="@/assets/Divitiae-1.png" id="navLogo" ></router-link>
          <div class="ms-auto h-100 me-6" v-if="!user">
            <ul class="navbar-nav ms-auto my-auto d-flex flex-row">
              <li class="nav-item h-100">
                <router-link to="/login" class="nav-link rounded px-4">Login</router-link>
              </li>
              <li class="nav-item h-100">
                <router-link to="/signup" class="nav-link rounded px-4 bg-warning text-secondary">Sign up</router-link>
              </li>
            </ul>
          </div>
          <div id="session" class="ms-auto h-100" v-if="user">
            <ul class="navbar-nav ms-auto my-auto d-flex flex-row">
              <li class="nav-item h-100">
                <router-link to="/home" class="nav-link rounded px-2" id="usernameNav">Hi, {{ this.user.userName }}!</router-link>
              </li>
              <li class="nav-item h-100">
                <router-link to="/logout" class="nav-link" id="logoutButton"><img src="@/assets/logout.png"/></router-link>
              </li>
            </ul>
          </div>  
        </div>
      </nav>
    </div>
  </template>

<script>
import { RouterView } from 'vue-router';
import {mapGetters} from 'vuex';




    export default {
    name: "Nav",
    components: { RouterView },
    computed: {
      ...mapGetters(['user']),

    },
    methods: {
      signOut() {
        this.$router.push('/')
        localStorage.removeItem('token');
        localStorage.removeItem('vuex');
        localStorage.removeItem('environment');
        this.$store.dispatch('user', false);
        this.$store.dispatch('environment', false);
        
      }
    }
}

</script>