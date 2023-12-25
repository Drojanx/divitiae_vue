<template>
  <div id="environmentConfig">
    <AppBar/>
    <EnvironmentConfig/>
  </div>
</template>

<script>

  import EnvironmentConfig from '../components/EnvironmentConfig.vue'
  import AppBar from '../components/Bars/AppBar.vue'

  export default {
      name: 'EnvironmentConfigView',
      components: {
        EnvironmentConfig,
        AppBar
      },
      beforeCreate: function() {
        document.body.className = 'app';
      }
  }
</script>