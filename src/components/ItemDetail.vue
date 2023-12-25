<template>
    <Teleport to="body">
        <div id="itemDetailSection">
            <form id="itemDetail" class="container-fluid p-0" @submit.prevent="" >
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
                    <div v-for="(field, index) in stateApp.fields" :id="index + '-field'" :key="field.nameAsProperty" class="d-flex justify-content-between item-detail-row" @click="focusInput($event)">
                        <span class="w-30 py-2 itemDetailKey text-end">{{ field.name }}</span> 
                        <div class="col-3 w-70 itemDetailValue" :class="inputType(field)">
                            <input :class="index + '-field'" @blur ="test($event)" v-if="inputType(field) != 'checkbox'" :type="inputType(field)" :step="stepStep(field).toString()" v-model="stateItemDetail.fields[field.nameAsProperty]" :value="stateItemDetail.fields[field.nameAsProperty]" :title="stateItemDetail.fields[field.nameAsProperty]"/>  
                            <label v-if="inputType(field) == 'checkbox'" class="switch" :title="stateItemDetail.fields[field.nameAsProperty]">
                                <input :class="index + '-field'" @change ="test($event)" type="checkbox" :step="stepStep(field).toString()" v-model="stateItemDetail.fields[field.nameAsProperty]" :value="stateItemDetail.fields[field.nameAsProperty]">
                                <span class="slider round"></span>
                            </label>
                        </div>
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
        name: 'ItemDetail',
        computed: {
            
        ...mapGetters(['environment', 'stateWorkspace', 'stateItems', 'stateApp', 'stateItemDetail', 'isAdminInCurrentEnv', 'updateItem']),

        },
        data() {
            return {
                fullPage: false,
                loadedApp: null,
                previousItem: {},
                originalStructureItem: {}
            }
        },
        async mounted() {
            window.addEventListener('click', this.handleClickOutsideOfDetail);
            this.previousItem = JSON.parse(JSON.stringify(this.stateItemDetail));   
            await axios.get(`app/${this.stateApp.id}/item/${this.stateItemDetail._id}`)
                .then((response) => {
                    this.originalStructureItem = response.data;
                    console.log(response.data)
                })
        },
        props: ['loadedItem'],
        methods: {
            async test(event) {
/*                 console.log(event.target.type)
                console.log(event.target.value) */
                if (event.target.type == "number" && event.target.value == "") {
                    event.target.value = 0;
                    return;
                }
                /* console.log(this.originalStructureItem) */
                this.originalStructureItem.fieldsValue.forEach((field) => {
                    console.log(JSON.parse(JSON.stringify(field.value)));

                    if (field.type == "date") {

                        console.log(this.stateItemDetail.fields[field.nameAsProperty])
                        // Get the date string from the value
                        const dateString = this.stateItemDetail.fields[field.nameAsProperty];

                        // Parse the date string into a Date object
                        const date = new Date(dateString);
                        console.log(date)

                        // Convert the Date object to a timestamp
                        const timestamp = date.getTime()/1000;
                        console.log(timestamp)
                        console.log(date.getTimezoneOffset())
                        // Convert the timestamp to UTC format
                        const cetOffset = date.getTimezoneOffset() * -60;
                        const utcTimestamp = timestamp + cetOffset;

                        console.log(utcTimestamp)
                        field.value = utcTimestamp;

                    } else{
                        field.value = this.stateItemDetail.fields[field.nameAsProperty]
                        console.log(JSON.parse(JSON.stringify(field.value)));

                    }


                })
                console.log(JSON.parse(JSON.stringify(this.originalStructureItem)));

                if (_.isEqual(this.stateItemDetail, this.previousItem)) {
                    console.log("NO CHANGES")
                }
                if (!_.isEqual(this.stateItemDetail, this.previousItem)) {
                    console.log("CHANGED")
                    console.log(JSON.parse(JSON.stringify(this.originalStructureItem)));
                    await axios.put(`app/${this.stateApp.id}/item/${this.stateItemDetail._id}`, JSON.parse(JSON.stringify(this.originalStructureItem)))
                        .then(() => {
                            this.$store.dispatch('updateItem', this.stateItemDetail);
                            var row = document.getElementById(event.target.className.replace(/switch/g,''));
                            console.log(event.target.className.replace(/switch/g,''))
                            console.log(row)
                            row.classList.add("success-field-change");
                            setTimeout(() => {
                                row.classList.remove("success-field-change");
                            },2000)
                        })
                        .catch((error) => {
                            console.log(error);
                            var row = document.getElementById(event.target.className.replace(/switch/g,''));
                            console.log(event.target.className.replace(/switch/g,''))
                            console.log(row)
                            row.classList.add("success-field-change");
                            setTimeout(() => {
                                row.classList.remove("success-field-change");
                            },2000)
                        })

                    
                }
                /* console.log(this.stateItemDetail.fields) */
            },
            async closeItem() {
                this.$store.dispatch('stateItemDetail', null);
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
                /* let loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.loadingArea,
                    onCancel: this.onCancel,
                }); */
                let app = this.stateWorkspace.apps.find(app => app.id == relatedAppId)
                this.$store.dispatch('stateItemDetail', null);
                this.$router.push({ name: 'item', params: { environmentNameURL: this.environment.environmentNameURL, workspaceNameURL: this.stateWorkspace.workspaceNameURL, appNameURL: app.appNameURL, itemId: relatedItemId}});
                
                /* loader.hide(); */
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
                        type = 'date';
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