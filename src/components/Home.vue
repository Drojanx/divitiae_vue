<template>
    <div class="container">
        <h1 class="text-center mt-3">Welcome back, {{ this.user.userName }}!</h1>
        <div id="homeContent" class="container d-flex py-4 px-3">
            <div id="newEnvironment" class="w-100 text-center">
                <p>Do you want to create a new environment?</p>


                <div class="form-group" v-if="this.addEnvironmentForm">                
                    <input type="text" required />
                    <label>Environment Name</label>
                    <div class="text-danger" v-if="sent && v$.first_name.$error">Please, type your first name.</div>
                </div>

                <div class="mt-0 d-flex justify-content-between w-20 mx-auto">
                    <fa v-if="!this.addEnvironmentForm" class="addElementsIcon" icon="plus-square" @click="openEnvironmentForm"/>
                    <fa v-if="this.addEnvironmentForm" class="addElementsIcon" icon="square-check" style="color: #00ccff;" @click="insertWorkspace"/>
                    <fa v-if="this.addEnvironmentForm" class="addElementsIcon" icon="square-xmark" style="color: #ff0000;" @click="openEnvironmentForm"/>
                </div>
            </div>
            <div id="pendingTasks">
                <p>Pending tasks</p>
            </div>
            
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';


    export default {
        name: 'Home',
        computed: {
            
        ...mapGetters(['user']),

        },
        data() {
            return {
                fullPage: false,
                addEnvironmentForm: false
            }
        },
        watch: {
            $route: {
                immediate: true,
                handler(to, from) {
                    document.title = to.meta.title || 'Divitiae - Home';
                }
            },
        },
        methods: {
            async openEnvironmentForm() {
                this.addEnvironmentForm = !this.addEnvironmentForm;
                var value = "Alejandro's, ,:environment".toLowerCase().replace(/ /g, "-").replace(/[^a-zA-Z0-9-]/g, "");

                console.log(this.user.workEnvironments[0].environmentName.toLowerCase())
                console.log(value)
            },
        }
    }
</script>

<style>

</style>