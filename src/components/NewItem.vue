<template>
    <Teleport to="body">
        <div id="itemDetailSection">
            <form id="newAppForm" class="container-fluid p-0" @submit.prevent="insertItem()" >
                <div id="itemDetailNav" class="d-flex justify-content-between flex-row-reverse"><fa icon="fa-solid fa-xmark" @click="closeItem()"/><fa icon="fa-solid fa-arrow-left" @click="goBack()"/></div>
                <input id="newAppName" type="text" placeholder="New Item..." v-model="stateNewItem._descriptiveName">
                <div class="container-fluid w-100 p-0">
                    <div v-for="(field, index) in stateApp.fields" :id="index + '-field'" :key="field.nameAsProperty" class="d-flex justify-content-between item-detail-row" @click="focusInput($event)">
                        <span class="w-30 py-2 itemDetailKey text-end">{{ field.name }}</span> 
                        <div class="col-3 w-70 itemDetailValue" :class="inputType(field)">
                            <input :class="index + '-field'" v-if="inputType(field) != 'checkbox'" :type="inputType(field)" :step="stepStep(field).toString()" v-model="stateNewItem[field.nameAsProperty]"/>  
                            <label v-if="inputType(field) == 'checkbox'" class="switch" >
                                <input :class="index + '-field'" type="checkbox" :step="stepStep(field).toString()" v-model="stateNewItem[field.nameAsProperty]">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div v-for="(relationField) in stateApp.relationFields" :key="relationField.nameAsProperty" class="d-flex justify-content-between ">
                        <span class="w-30 py-2 itemDetailKey text-end">{{ relationField.name }}</span> 
                        <div class="w-70 py-2 itemDetailValue"> 
                            <!-- <div class="relationFieldCard" @click="loadRelatedItem(relationField.appRelationId, stateItemDetail.relationFields[relationField.nameAsProperty].relatedItemId)"> 
                                <span>{{ stateItemDetail.relationFields[relationField.nameAsProperty].relatedAppName }}</span>
                                <br><a>{{ stateItemDetail.relationFields[relationField.nameAsProperty].relatedItemName }}</a>
                                <p>ID: {{ stateItemDetail.relationFields[relationField.nameAsProperty].relatedItemId }}</p>
                            </div> -->
                            <input type="text"/>
                        </div>
                                                                                        
                    </div>                
                    
                </div>
                <div id="createAppButton" class="text-center">
                        <button class="btn btn-block">Create</button>
                </div>
            </form>
        </div>
    </Teleport>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex';
import { getItem, getWorkspaceApp } from '../router/index.js'
import _ from 'lodash'


    export default {
        name: 'NewItem',
        computed: {
            
        ...mapGetters(['environment', 'stateWorkspace', 'stateItems', 'stateApp', 'stateItemDetail', 'isAdminInCurrentEnv', 'updateItem', 'stateNewItem']),

        },
        data() {
            return {
                fullPage: false,
                loadedApp: null,
                previousItem: {},
                originalStructureItem: {}
            }
        },
        methods: {
            async insertItem(){
                console.log(JSON.parse(JSON.stringify(this.stateNewItem)));
            },  
            async closeItem() {
                this.$store.dispatch('stateNewItem', null);
                this.$router.push({ name: 'app', params: { environmentNameURL: this.environment.environmentNameURL, workspaceNameURL: this.stateWorkspace.workspaceNameURL, appNameURL: this.stateApp.appNameURL } });
            },
            async focusInput(event) {
                if(event.target.firstChild !== null && event.target.firstChild !== undefined) {
                    try {
                        event.target.firstChild.focus();
                    } catch (error) {
                    }
                }
            },
            async goBack() {
                this.$store.dispatch('stateItemDetail', null);
                this.$router.go(-1);
            },
            async handleClickOutsideOfDetail(e) {
                e.stopPropagation();
                if (document.getElementById('itemDetailSection') == e.target){
                    this.closeItem();
                }
            },
            async loadRelatedItem(relatedAppId, relatedItemId){

                let app = this.stateWorkspace.apps.find(app => app.id == relatedAppId)
                this.$store.dispatch('stateItemDetail', null);
                this.$router.push({ name: 'item', params: { environmentNameURL: this.environment.environmentNameURL, workspaceNameURL: this.stateWorkspace.workspaceNameURL, appNameURL: app.appNameURL, itemId: relatedItemId}});
                
            },
            inputType(appField) {

                let type = 'text';
                switch (appField.type){
                    case "string":
                        type = "text";
                        break;
                    case "int":
                        type = "number";
                        break;
                    case "decimal":
                        type = "number";
                        break;
                    case "currency":
                        type = "number";
                        break;
                    case "date":
                        type = 'datetime-local';
                        break;
                    case "boolean":
                        type = "checkbox";
                        break;
                }
                return type;
            },
            stepStep(appField) {

                let step = "";
                switch (appField.type){
                    case "decimal":
                        step = "any";
                        break;
                    case "currency":
                        step = ".01";
                        break;
                }

                return step;
            }
            
        },
        async beforeRouteUpdate(to, from, next){
            
            await getWorkspaceApp(to.params.appNameURL);
            await getItem(to.params.itemId);

            next();
        }
    }

    
</script>

<style>

</style>