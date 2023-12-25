<template>
    <Teleport to="body">
        <div id="newUserFormSection">
            <form id="newUserForm" class="container-fluid p-0" @submit.prevent="inviteUser()">
                <div id="itemDetailNav" class="d-flex justify-content-between flex-row-reverse"><fa icon="fa-solid fa-xmark" @click="closeForm()"/></div>
                <h3 id="newAppName">{{ editingUser.userName + " " + editingUser.userLastName }}</h3>
                <div class="container-fluid w-100 p-0">
                    <div class="d-flex justify-content-between newAppField me-5" style="flex-wrap: wrap;">
                        <div class="w-30 d-flex" style="align-items: center; justify-content: end;">
                            <small>ID</small>   
                        </div>
                        <small class="w-70 py-2 newAppFieldType" type="text">{{ editingUser.userId }}</small>  
                    </div>
                    <div class="d-flex justify-content-between newAppField me-5" style="flex-wrap: wrap;">
                        <div class="w-30 d-flex" style="align-items: center; justify-content: end;">
                            <span>Email</span>   
                        </div>
                        <span class="w-70 py-2 newAppFieldType" type="text">{{ editingUser.userEmail }}</span> 
                    </div>
                    <div class="d-flex justify-content-between newAppField me-5" style="flex-wrap: wrap;">
                        <div class="w-30 d-flex" style="align-items: center; justify-content: end;">
                            <span>Admin</span>   
                        </div>
                        <div class="w-70 py-2 newAppFieldType">
                            <label class="switch" >
                                <input type="checkbox" v-model="editingUser.workEnvironment.isAdmin">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between newAppField me-5" style="flex-wrap: wrap;">
                        <div class="w-30"></div>
                        <div class="w-70 py-2 newAppFieldType" style="align-items: center; justify-content: end;">
                            <span style="font-size: smaller;">Workspaces' accesses</span>   
                        </div>
                    </div>


                    <div class="d-flex justify-content-between newAppField me-5" v-for="(workspace, index) in environment.workspaces" style="flex-wrap: wrap;">
                        <div class="w-30 d-flex" style="align-items: center; justify-content: end;">
                            <span :title="workspace.workspaceName" class="w-80 text-end px-0 newAppFieldName h-100">{{ workspace.workspaceName }}</span> 
                        </div>
                        <div class="w-70 py-2 newAppFieldType" style="align-items: center; justify-content: end;">
                            <label class="switch" >
                                <input type="checkbox" v-model="editingUser.workEnvironment.workspaces[workspace.id]">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div id="createAppButton" class="text-center">
                        <button class="btn btn-block">Update</button>
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
        name: 'UserInfo',
        computed: {
            
        ...mapGetters(['stateWorkspace', 'stateNewAppFormIsOpen', 'stateApp', 'stateFieldTypes', 'environment', 'editingUser']),
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
                checkedWorkspaces: {}
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

                console.log(this.invitedUserEmail);
                console.log(this.isAdministrator);
                console.log(this.checkedWorkspaces);
                loader.hide();
            }
        }
    }
</script>

<style>

</style>