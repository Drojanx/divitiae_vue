<template>
  <div id="myApp" class="d-flex flex-column" :class="appClass">
    <Nav />
    
    <div class="auth-wrapper">
      <div class="auth-inner" ref="loadingArea">
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
  import Nav from './components/Bars/Nav.vue'
  import {mapGetters} from 'vuex';

  export default {
    name: 'App',
    components: {
      Nav
    },
    computed: {
      ...mapGetters(['appClass'])

    },
    async created() {
      if (localStorage.getItem('token') !== null) {
        const response = await axios.get('user/userdata');
        var userData = response.data.userData;

        let existingNames = {};
        userData.workEnvironments.forEach((we) => {
          let nombreUrlFriendly = we.environmentName.toLowerCase().replace(/ /g, "-").replace(/[^a-zA-Z0-9-]/g, "");
          
          // Verifica si ya existe el nombreUrlFriendly
          if (existingNames[nombreUrlFriendly] !== undefined) {
              // Genera un nuevo nombre único
              let count = existingNames[nombreUrlFriendly]++;
              nombreUrlFriendly += `(${count})`;
          } else {
            existingNames[nombreUrlFriendly] = 1;
          }
          
          we.environmentNameURL = nombreUrlFriendly;
        });
        this.$store.dispatch('user', userData);
        console.log("userdata updated")
      }
    },
    watch: {
        $route: {
            immediate: true,
            handler(to, from) {
                document.title = to.meta.title || 'Divitiae';
            }
        },
    },
    methods: {
    showLoader() {
      return this.$loading.show({
        container: this.$refs.loadingArea,
        // otras configuraciones
      });
    },
  }
  }
</script>