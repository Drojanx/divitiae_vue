<template>
    <div id="vpCentered" class="px-0">
        <div id="workspaceName">
            <h3 class="text-center">{{ stateWorkspace.workspaceName }}</h3>
            
        </div>
        <div id="workspaceContent" class="pb-4 pt-3 px-3">
            <div id="workspaceHeader" class="container-fluid">
                <p class="text-center" style="margin-bottom: 0;">Apps</p>
                
                <div id="appScroll" class='d-flex ' style="overflow-y: auto; max-height: 400px;">
                    <div v-for="app in this.stateWorkspace.apps" :key="app.id" class="mx-1 my-1 col text-center appTab" style="cursor: pointer;" :title="app.appName ">
                        <RouterLink class="p-2" :to=" { name: 'app', params: {environmentNameURL: this.environment.environmentNameURL, workspaceNameURL: this.stateWorkspace.workspaceNameURL, appNameURL: app.appNameURL}}" style="text-decoration: none;"> {{ app.appName }} </RouterLink>
                    </div>
                    <div class="mt-0 d-flex w-10" v-if="isAdminInCurrentEnv">
                        <fa class="addElementsIcon" icon="plus-square" @click="openAppForm"/>
                    </div>
                </div>
            </div>
            <!-- <router-view v-if="this.stateApp!==null"></router-view> -->
            <!-- <WorkspaceApp v-if="this.loadedApp!==null" /> -->
            <router-view v-slot="{ Component }">
                <component :is="Component" />
            </router-view>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import WorkspaceApp from './WorkspaceApp.vue';
import NewAppForm from './NewAppForm.vue'
import {mapActions, mapGetters} from 'vuex';
import { getWorkspace } from '../router/index.js'

    export default {
        name: 'Workspace',
        computed: {
            
        ...mapGetters(['environment', 'stateWorkspace', 'stateNewAppFormIsOpen', 'stateApp', 'isAdminInCurrentEnv']),

        },
        data() {
            return {
                fullPage: false,
                loadedApp: null,
            }
        },
        components: {
            WorkspaceApp,
            NewAppForm
        },
        watch: {
            $route: {
                immediate: true,
                handler(to, from) {
                    document.title = to.meta.title || `${this.stateWorkspace.workspaceName}`;
                }
            }
        },
        methods: {

            async openAppForm() {                    
                this.$router.push({ name: 'new-app-form', params: { environmentNameURL: this.environment.environmentNameURL, workspaceNameURL: this.stateWorkspace.workspaceNameURL } });
            },
        },
        async beforeRouteUpdate(to, from, next){

            if (to.params.workspaceNameURL !== from.params.workspaceNameURL){
                this.$store.dispatch('stateWorkspace', null);
                this.$store.dispatch('stateItems', null);
                this.$store.dispatch('stateApp', null);
                
                await getWorkspace(to.params.workspaceNameURL);
                next();
            } else {
                next();
            }
        }
    }
</script>

<style>

</style>