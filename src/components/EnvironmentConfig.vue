<template>
    <div id="vpCentered" class="px-0">
        <div id="envName">
            <h3 class="text-center">{{ environment.environmentName }} - Configuration</h3>            
        </div>
        <div id="configContent" class="pb-4 pt-3 px-3">
            <div id="configInfo" class="container-fluid">
                <p class="mb-1 mt-3">Environment's name</p> 
                <div class="col-3">
                    <input id="envNameInput" class="effect-1" type="text" :value="environment.environmentName"> 
                    <span class="focus-border">
                        <i></i>
                    </span>
                </div>
                <button class="appTab">Update</button>
            </div>
            <div class="d-flex w-90 justify-content-between mx-auto">
                <p class="mb-1 mt-5 text-center"  style="align-self: center">Environment's users</p> 
                <button class="appTab" style="align-self: flex-end" @click="openAddUserForm()">Add users</button>
            </div>

            <div class="row mt-3" style="overflow-y: auto; max-height: 85%;">
                    <table id="usersList" class="table table-hover text-center">
                        <thead class="thead-greenish">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col" style="min-width: 8rem;">User Name</th>
                                <th scope="col" style="min-width: 8rem;">User Email</th>
                                <th scope="col" style="min-width: 8rem;">Role</th>
                                <th scope="col" style="min-width: 2rem;">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index, i) in environment.usersData" :key="item.userId">
                                <th scope="row"> {{ index+1 }} </th>
                                <td :title="item.userDisplayName"><span>{{ item.userDisplayName }}</span></td>
                                <td :title="item.userEmail"><span>{{ item.userEmail }}</span></td>
                                <td title="admin">
                                    <span v-if="item.isAdmin">Administrator</span>
                                    <span v-if="!item.isAdmin">Regular User</span>
                                </td>
                                <td title="edit" id="edit-user" @click="openUserInfo(item.userId)"><fa icon="fa-solid fa-ellipsis"></fa></td>
                            </tr>                     
                        </tbody>
                    </table>
                </div>
        </div>
        <router-view v-slot="{ Component }">
                <component :is="Component" />
        </router-view>
    </div>
</template>

<script>
import axios from 'axios';
import WorkspaceApp from './WorkspaceApp.vue';
import NewAppForm from './NewAppForm.vue'
import {mapActions, mapGetters} from 'vuex';
import { getWorkspace } from '../router/index.js'

    export default {
        name: 'EnvironmentConfig',
        computed: {
            
        ...mapGetters(['environment', 'stateWorkspace', 'stateNewAppFormIsOpen', 'stateApp', 'isAdminInCurrentEnv']),

        },
        data() {
            return {
                fullPage: false,
                loadedApp: null,
                addUserFormOpen: false
            }
        },
        mounted() {
            /* var input = document.getElementById('envNameInput');
            input.style.width = input.value.length + 'ch'; */
        },
        watch: {
            /* $route: {
                immediate: true,
                handler(to, from) {
                    document.title = to.meta.title || `${this.stateWorkspace.workspaceName}`;
                }
            } */
        },
        methods: {
            async openAddUserForm(){
                let loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.loadingArea,
                    onCancel: this.onCancel,
                    width: 80,
                    height: 80,
                    color: "#ffc107"
                });

                this.$router.push({ name: 'environmentAddUserView', params: { id: this.environment.id } });

                loader.hide();
            },
            async openUserInfo(userId){

                this.$router.push({ name: 'edit-user', params: { id: this.environment.id, userId:  userId} });

            }
        },
        async beforeRouteUpdate(to, from, next){
            let loader = this.$loading.show({
                // Optional parameters
                container: this.fullPage ? null : this.$refs.loadingArea,
                onCancel: this.onCancel,
            });

            if (to.params.wsId !== from.params.wsId){
                this.$store.dispatch('stateWorkspace', null);
                this.$store.dispatch('stateItems', null);
                this.$store.dispatch('stateApp', null);
                
                await getWorkspace(to.params.wsId);
                next();
                loader.hide();
            } else {
                next();
                loader.hide();
            }
        }
    }
</script>

<style>

</style>