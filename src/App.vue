<template>
  <div id="myApp" class="d-flex flex-column">
    <Nav />
    
    <div class="auth-wrapper">
      <div class="auth-inner">
        <Router-view v-slot="{ Component }">
          <Transition name="route" mode="out-in">
            <component :is="Component"></component>
          </Transition>
        </Router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Nav from './components/Nav.vue'

  export default {
    name: 'App',
    components: {
      Nav
    },
    watch: {
        $route: {
            immediate: true,
            handler(to, from) {
                document.title = to.meta.title || 'Divitiae';
            }
        },
    },
    async created() {
      const response = await axios.get('user');

      this.$store.dispatch('user', response.data);
    }
  }
</script>