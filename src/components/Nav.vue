<template>
    <div>
      <nav class="navbar navbar-dark">
        <div class="container">
          <router-link to="/" class="navbar-brand my-auto px-4 rounded"><img src="../assets/Divitiae-1.png" id="navLogo">Divitiae</router-link>
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
          <div class="ms-auto h-100 me-6" v-if="user">
            <ul class="navbar-nav ms-auto my-auto">
              <li class="nav-item h-100">
                <router-link to="/profile" class="nav-link rounded px-4">Hi, {{ this.user.name }}!</router-link>
              </li>
              <li class="nav-item h-100">
                <button v-on:click="signOut" class="nav-link rounded px-4 bg-warning text-secondary">Sign out</button>
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
      ...mapGetters(['user'])

    },
    methods: {
      signOut() {
        localStorage.removeItem('token');
        this.$store.dispatch('user', null);
        this.$router.push('/')
      },
      check() {
        
      }
    }
}

</script>