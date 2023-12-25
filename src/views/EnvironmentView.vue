<template>
  <div id="environment">
    <AppBar/>
    <Environment/>
  </div>
</template>

<script>

  import Environment from '../components/Environment.vue'
  import AppBar from '../components/Bars/AppBar.vue'

  export default {
      name: 'EnvironmentView',
      components: {
        Environment,
        AppBar
      },
      beforeCreate: function() {
        document.body.className = 'app';
      }
  }
</script>