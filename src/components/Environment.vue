<template>
    <div class="">
        <div id="environmentChildrenSection" class="d-flex">
            <div  style="align-self: flex-start;">
                <div class="mx-auto">
                    <p class="text-center" style="margin-top: 1.5rem; font-weight: bold">{{ this.environment.environmentName }} <fa v-if="isAdminInCurrentEnv" @click="openConfig()" icon="fa-solid fa-wrench"></fa></p>
                </div>
                
                <div  id="wsList" class="pb-4 pt-4 px-3">
                    <p class="text-center" style="margin-bottom: 0;">Workspaces</p>
                    <input v-if="this.addWorkspaceForm" v-model="newWorkspaceName" type="text" class="form-control w-50 mx-auto my-2" placeholder="Workspace name...">

                    <div class="mt-0 d-flex justify-content-between w-20 mx-auto" v-if="isAdminInCurrentEnv">
                        <fa v-if="!this.addWorkspaceForm" class="addElementsIcon" icon="plus-square" @click="openWorkspaceForm"/>
                        <fa v-if="this.addWorkspaceForm" class="addElementsIcon" icon="square-check" style="color: #00ccff;" @click="insertWorkspace"/>
                        <fa v-if="this.addWorkspaceForm" class="addElementsIcon" icon="square-xmark" style="color: #ff0000;" @click="openWorkspaceForm"/>
                    </div>


                    <div class="container-fluid">
                        <div id="environmentList" class="row d-flex align-items-center" style="overflow-y: auto;">
                            <template v-for="workspace in this.environment.workspaces" :key="workspace.id">
                            <div class="my-1 col text-center workspaceTab" style="cursor: pointer;" :title="workspace.workspaceName " >
                                <RouterLink class="p-2" :to=" { name: 'workspace', params: {environmentNameURL: this.environment.environmentNameURL, workspaceNameURL: workspace.workspaceNameURL}}" style="text-decoration: none;"> {{ workspace.workspaceName }} </RouterLink>
                            </div>
                            </template>
                            
                            
                            <!-- <div v-for="workspace in this.environment.Workspaces" :key="workspace.id" class="p-2 my-1 col text-center workspaceTab" style="cursor: pointer;" @click="loadWorkspace(workspace.Id)">{{ workspace.WorkspaceName }}</div> -->
                        </div>
                    </div>
                </div>
                
                
            </div>
            <router-view v-if="this.stateWorkspace!==null"></router-view>
            <!-- <Workspace v-if="this.loadedWorkspace!==null" :workspace="loadedWorkspace"/> -->
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Workspace from '../components/Workspace.vue';
import {mapGetters} from 'vuex';
import { getEnvironment } from '../router/index.js'
import createStore from '../store/index.js';

    export default {
        name: 'Environment',
        computed: {
            
        ...mapGetters(['environment', 'stateWorkspace', 'isAdminInCurrentEnv'])

        },
        components: {
            Workspace
        },
        data() {
            return {
                fullPage: false,
                addWorkspaceForm: false,
                newWorkspaceName: "",
            }
        },
        watch: {
            $route: {
                immediate: true,
                async handler(to, from) {                    
                    document.title = to.meta.title || `${this.environment.environmentName}`;
                    if(from != undefined && to.params != undefined){

                        if (to.params.environmentNameURL != undefined && from.params.environmentNameURL != undefined && to.params.environmentNameURL !== from.params.environmentNameURL) {

                            createStore.dispatch('environment', "");
                            createStore.dispatch('stateWorkspace', "");
                            createStore.dispatch('stateItems', "");
                            createStore.dispatch('stateApp', "");

                            await getEnvironment(to.params.environmentNameURL);
                            
                        }
                    }

                }
            }
        },
        methods: {
            async openWorkspaceForm() {
                this.addWorkspaceForm = !this.addWorkspaceForm;
            },
            async insertWorkspace() {
                let loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.loadingArea,
                    onCancel: this.onCancel,
                    color: "#ffc107",
                    width: 80,
                    height: 80
                });

                await axios.post(`workspace/${this.environment.id}/add`, {
                    workspaceName: this.newWorkspaceName
                })
                .then( (response) => {
                        console.log(response)
                        this.$store.dispatch('addWorkspaceToEnvironment', response.data);
                        loader.hide();                    
                });
            },
            /*
            * TODO: probar respuesta API al traer workspace
            */
            async loadWorkspace(workspaceId) {
                /* let loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.loadingArea,
                    onCancel: this.onCancel,
                }); */
                var loadedWorkspace = this.environment.Workspaces.find(workspace => workspace.Id == workspaceId);

                this.$router.push({ name: 'workspace', params: { environmentNameURL: this.environment.environmentNameURL, wsId: loadedWorkspace.Id } });
                
                /* loader.hide(); */
            },
            async openConfig() {
                /* let loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.loadingArea,
                    onCancel: this.onCancel,
                }); */
                this.$router.push({ name: 'environmentConfigView', params: { id: this.environment.id } });

                /* loader.hide(); */
            }
        }
    }
</script>

<style>

</style>