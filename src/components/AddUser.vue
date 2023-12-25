<template>
    <Teleport to="body">
        <div id="newUserFormSection">
            <form id="newUserForm" class="container-fluid p-0" @submit.prevent="inviteUser()">
                <div id="itemDetailNav" class="d-flex justify-content-between flex-row-reverse"><fa icon="fa-solid fa-xmark" @click="closeForm()"/></div>
                <h3 id="newAppName">Add new user</h3>
                <div class="container-fluid w-100 p-0">
                    <div class="d-flex justify-content-between newAppField me-5" style="flex-wrap: wrap;">
                        <div class="w-30 d-flex" style="align-items: center; justify-content: end;">
                            <span>Email</span>   
                        </div>
                        <input class="w-70 py-2 newAppFieldType" type="text" placeholder="User's email..." v-model="invitedUserEmail">
                        <span class="text-danger w-70 py-2 newAppFieldType ms-auto" v-if="this.wrongEmail">Couldn't find user with given email.</span>   
                        <span class="text-danger w-70 py-2 newAppFieldType ms-auto" v-if="this.internalError">Something happened while adding user. Try again later.</span>   
                    </div>
                    <div class="d-flex justify-content-between newAppField me-5" style="flex-wrap: wrap;">
                        <div class="w-30 d-flex" style="align-items: center; justify-content: end;">
                            <span>Admin</span>   
                        </div>
                        <div class="w-70 py-2 newAppFieldType">
                            <label class="switch" >
                                <input type="checkbox" v-model="isAdministrator">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between newAppField me-5" style="flex-wrap: wrap;">
                        <div class="w-30"></div>
                        <div class="w-70 py-2 newAppFieldType" style="align-items: center; justify-content: end;">
                            <span style="font-size: smaller;">Select what workspaces will the user have access to</span>   
                        </div>
                    </div>


                    <div class="d-flex justify-content-between newAppField me-5" v-for="(workspace, index) in environment.workspaces" style="flex-wrap: wrap;">
                        <div class="w-30 d-flex" style="align-items: center; justify-content: end;">
                            <span :title="workspace.workspaceName" class="w-80 text-end px-0 newAppFieldName h-100">{{ workspace.workspaceName }}</span> 
                        </div>
                        <div class="w-70 py-2 newAppFieldType" style="align-items: center; justify-content: end;">
                            <label class="switch" >
                                <input type="checkbox" v-model="checkedWorkspaces[workspace.id]"> 
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div id="createAppButton" class="text-center">
                        <button class="btn btn-block">Create</button>
                    </div>
                    
                </div>
            </form>   
        </div>
    </Teleport>  
</template>

<script>
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {mapGetters} from 'vuex';


    export default {
        name: 'AddUserForm',
        computed: {
            
        ...mapGetters(['stateWorkspace', 'stateNewAppFormIsOpen', 'stateApp', 'stateFieldTypes', 'environment']),
        appFields: function() {

            return this.newAppFields;
        }

        },async mounted() {
            window.addEventListener('click', this.handleClickOutsideOfAppForm);
        },
        async created() {
            this.environment.workspaces.forEach(ws => {
                this.checkedWorkspaces[ws.id] = false;
            });
        },
        data() {
            return {
                fullPage: false,
                loadedApp: null,
                invitedUserEmail: "",
                isAdministrator: false,
                checkedWorkspaces: {},
                wrongEmail: false,
                internalError: false
            }
        },
        watch: {
            $route: {
                immediate: true,
                handler(to, from) {
                    document.title = to.meta.title || `Add user`;
                }
            }
        },
        async mounted() {
            window.addEventListener('click', this.handleClickOutsideOfAppForm);
        },
        methods: {
            async closeForm() {
                this.$router.push({ name: 'environmentConfigView', params: { id: this.environment.id } });
                
            },
            async handleClickOutsideOfAppForm(e) {
                e.stopPropagation();
                if ('newUserFormSection' == e.target.id){
                    this.closeForm();
                }
            },
            async inviteUser() {
                let loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.loadingArea,
                    onCancel: this.onCancel,
                });

                await axios.get(`user/by-email/${this.invitedUserEmail}`)
                    .then ( async (response) => {
                        console.log(response);
                        console.log(this.checkedWorkspaces)

                        var workspaces = []

                        for (const ws in this.checkedWorkspaces) {
                            if (this.checkedWorkspaces[ws] == true) {
                                workspaces.push(ws);
                            }
                        }

                        console.log("acá")
                        console.log(workspaces)
                        
                        var addUserRequest = {
                            UserId: response.data,
                            WorkspaceIds: workspaces,
                            IsAdmin: this.isAdministrator
                        }

                        await axios.post(`environment/${this.environment.id}/add-user`, addUserRequest)
                            .then((response) => {
                                console.log("otra cosi")
                                console.log(response)
                                this.$store.dispatch('addUserToEnvironment', response.data);
                            })
                    })
                    .catch((error)=> {
                        console.log(error)
                        if (error.response){
                            if (error.response.status == 404){
                                this.wrongEmail = true;
                            } else {
                                this.internalError = true;
                            }
                        } else {
                            console.log(error)
                        }
                        loader.hide();

                    })

                

                loader.hide();
            }
        }
    }
</script>

<style>

</style>