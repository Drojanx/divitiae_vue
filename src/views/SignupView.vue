<template>
  <Signup/>
</template>

<script>

  import Signup from '../components/Signup.vue'

  export default {
      name: 'SignupView',
      components: {
        Signup
      },
      watch: {
        $route: {
            immediate: true,
            handler(to, from) {
                document.title = to.meta.title || 'Divitiae - Sign up';
            }
        },
      }
  }
</script>

<style>

#app {
  
}
</style>