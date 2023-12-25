<template>
    <Teleport to="body">
        <div id="itemDetailSection">
            <div id="itemDetail" class="container-fluid p-0">
                <div id="itemDetailNav" class="d-flex justify-content-between flex-row-reverse"><fa icon="fa-solid fa-xmark" @click="closeItem()"/><fa icon="fa-solid fa-arrow-left" @click="goBack()"/></div>
                <h1> {{ stateItemDetail._descriptiveName }} </h1>
                <div class="container-fluid w-100 p-0">
                    <div class="d-flex justify-content-between newAppField me-5" style="flex-wrap: wrap;" v-if="isAdminInCurrentEnv">
                        <div class="w-30 d-flex" style="align-items: center; justify-content: end;">
                            <fa icon="fa-solid fa-trash" />   
                        </div>
                    </div>
                    <div class="d-flex justify-content-between newAppField me-5" style="flex-wrap: wrap;" v-if="isAdminInCurrentEnv">
                        <div class="w-30 d-flex" style="align-items: center; justify-content: end;">
                            <small>ID</small>   
                        </div>
                        <small class="w-70 py-2 newAppFieldType" type="text">{{ stateItemDetail._id }}</small>  
                    </div>
                    <div v-for="(field) in stateApp.fields" :key="field.nameAsProperty" class="d-flex justify-content-between ">
                        <span class="w-30 py-2 itemDetailKey text-end">{{ field.name }}</span> <span class="w-70 py-2 itemDetailValue" v-if="(typeof stateItemDetail.fields[field.nameAsProperty] == `boolean` && stateItemDetail.fields[field.nameAsProperty] == true)"><fa icon="fa-check fa-solid" style="color:lightgreen"/></span>
                                                                                        <span class="w-70 py-2 itemDetailValue" v-if="(typeof stateItemDetail.fields[field.nameAsProperty] == `boolean` && stateItemDetail.fields[field.nameAsProperty] == false)"><fa icon="fa-solid fa-xmark" style="color:red"/></span>
                                                                                        <span class="w-70 py-2 itemDetailValue" v-if="(typeof stateItemDetail.fields[field.nameAsProperty] != `boolean`)"> {{ stateItemDetail.fields[field.nameAsProperty] }}</span>
                    </div>
                    <div v-for="(relationField) in stateApp.relationFields" :key="relationField.nameAsProperty" class="d-flex justify-content-between ">
                        <span class="w-30 py-2 itemDetailKey text-end">{{ relationField.name }}</span> 
                        <div class="w-70 py-2 itemDetailValue"> 
                            <div class="relationFieldCard" @click="loadRelatedItem(relationField.appRelationId, stateItemDetail.relationFields[relationField.nameAsProperty].relatedItemId)"> 
                                <span>{{ stateItemDetail.relationFields[relationField.nameAsProperty].relatedAppName }}</span>
                                <br><a>{{ stateItemDetail.relationFields[relationField.nameAsProperty].relatedItemName }}</a>
                                <p>ID: {{ stateItemDetail.relationFields[relationField.nameAsProperty].relatedItemId }}</p>
                            </div>
                        </div>
                                                                                        
                    </div>
                    <div id="relatedItems" >
                        <h5>Related Items</h5>
                        <div v-for="(relationData, propertyName) in stateItemDetail.relatedItemsByAppId" :key="propertyName" class="d-flex justify-content-between">
                            <div class="w-30 py-2 itemDetailKey text-end">
                                <span> {{ relationData.relatedAppName }}</span>
                            </div>
                            <div class="w-70 py-2 itemDetailValue">
                                <div v-for="relatedItem in relationData.relatedItems" class="relationFieldCard mb-1" @click="loadRelatedItem(propertyName, relatedItem.relatedItemId)">
                                    <span>{{ relationData.relatedAppName }}</span>
                                    <br><a>{{ relatedItem.relatedItemName }}</a>
                                    <p>ID: {{ relatedItem.relatedItemId }}</p>
                                </div>
                            </div>
                    </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex';
import { getItem, getWorkspaceApp } from '../router/index.js'


    export default {
        name: 'ItemDetailOld',
        computed: {
            
        ...mapGetters(['environment', 'stateWorkspace', 'stateItems', 'stateApp', 'stateItemDetail', 'isAdminInCurrentEnv']),

        },
        data() {
            return {
                fullPage: false,
                loadedApp: null,
            }
        },
        async mounted() {
            window.addEventListener('click', this.handleClickOutsideOfDetail);
        },
        props: ['loadedItem'],
        methods: {
            async closeItem() {
                this.$store.dispatch('stateItemDetail', null);
                this.$router.push({ name: 'app', params: { environmentNameURL: this.environment.environmentNameURL, workspaceNameURL: this.stateWorkspace.workspaceNameURL, appNameURL: this.stateApp.appNameURL } });
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
                /* let loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.loadingArea,
                    onCancel: this.onCancel,
                }); */
                let app = this.stateWorkspace.apps.find(app => app.id == relatedAppId)
                this.$store.dispatch('stateItemDetail', null);
                this.$router.push({ name: 'item', params: { environmentNameURL: this.environment.environmentNameURL, workspaceNameURL: this.stateWorkspace.workspaceNameURL, appNameURL: app.appNameURL, itemId: relatedItemId}});
                
                /* loader.hide(); */
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