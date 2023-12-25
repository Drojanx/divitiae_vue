<template>
  <div id="appDropdowns" class="d-flex justify-content-start mx-auto" v-if="user">
    <div class="dropdown">
      <button id="environmentspaceDrop" class="dropbtn" @click="openDropdown()">Environments<img src="@/assets/arrow.png"/></button>
      <div class="dropdown-content" id="environmentspaceDropContent">
        <router-link @click="openDropdown()" v-for="item in this.user.workEnvironments" :key="item.id" style="cursor: pointer;"  :to="{ name: 'environment', params: { environmentNameURL: item.environmentNameURL }}"><fa icon="people-group"/> {{ item.environmentName }}</router-link>
      </div>
    </div>
<!--     <div class="dropdown" v-if="currentView === '/home/environment'">
      <button id="workspaceDrop" class="dropbtn" @click="openDropdown($event)">Workspace<img src="@/assets/arrow.png"/></button>
      <div class="dropdown-content" id="workspaceDropContent">
        <a v-for="item in items"></a>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </div>
    </div> -->
  </div>
  </template>

<script>
import {useRoute} from 'vue-router'
import {computed} from 'vue'
import {mapGetters} from 'vuex';

    export default {
    name: "AppBar",
/*     setup(){
      const route=useRoute();

      const path = computed(() =>route.path)

      return {
        path
      }
    }, */
    computed : {
      ...mapGetters(['user'])/* ,
      currentView() {
        return this.path;
      } */
    },
    methods: {
      openDropdown() {
        var content = document.getElementById("environmentspaceDropContent");
        content.classList.toggle("notHidden")                    
      }
    }
    

}

</script>