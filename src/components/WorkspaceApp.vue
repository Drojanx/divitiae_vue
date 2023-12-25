<template>
    <div id="appContent" class="container px-0" v-if="stateApp != null">
        <div id="appName">
            <p class="text-center" > {{ stateApp.appName }}</p>
        </div>
        <div class="d-flex justify-content-end me-3">
            <div class="buttons">
                <span class="bg-warning btn-warning rounded-0 add-item-icon"><fa icon="fa-solid fa-plus"/></span>
                <span class="rounded-0 add-item-text text-align-center text-center">Add an item</span>                
            </div>
            </div>
        <div class="container d-flex py-1 px-3" style="height: 100%;">
            <div class="container-fluid" style="height: 100%;">
                <div class="row" style="overflow-y: auto; height: 90%;">                    
                    <table id="appItemsTable" class="table table-hover text-center">
                        <thead class="thead-greenish">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col" style="min-width: 8rem;">Item Name</th>
                                <th scope="col" v-for="field in stateApp.fields" :key="field.nameAsProperty" style="min-width: 8rem;"> 
                                    <template v-if="field.type != 'itemRelation'">{{ field.name }} </template>                                  
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index, i) in stateItems" :key="item._id" @click="handleRowClick(item, $event)">
                                <th scope="row"> {{ index+1 }} </th>
                                <td :title="item._descriptiveName"><span>{{ item._descriptiveName }}</span>
                                </td>
                                <td v-for="(field) in stateApp.fields" :key="field.nameAsProperty" v-bind:class = "(typeof item.fields[field.nameAsProperty] == `boolean`)?`is_boolean_${item.fields[field.nameAsProperty]}`:''" :title="item.fields[field.nameAsProperty]"> 
                                    <span v-if="(typeof item.fields[field.nameAsProperty] == `boolean` && item.fields[field.nameAsProperty] == true)"><fa icon="fa-check fa-solid" style="color:lightgreen"/></span>
                                    <span v-if="(typeof item.fields[field.nameAsProperty] == `boolean` && item.fields[field.nameAsProperty] == false)"><fa icon="fa-solid fa-xmark" style="color:red"/></span>
                                    <span v-if="(typeof item.fields[field.nameAsProperty] != `boolean` && field.type != `itemRelation`)"> {{ item.fields[field.nameAsProperty] }}</span>
                                </td>
                            </tr>                           
                        </tbody>
                    </table>
                </div>
            </div>            
        </div>
        <router-view v-if="this.stateItemDetail!==null" v-slot="{ Component }">
                <component :is="Component" />
        </router-view>
       <!--  <Transition name="fade">
            
            <router-view v-if="this.stateItemDetail!==null"></router-view> -->
            <!-- <div id="itemDetailSection" v-if="this.stateItemDetail !== null"><ItemDetail/></div> -->
        <!-- </Transition> -->
    </div>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex';
import ItemDetail from './ItemDetail.vue'
import { getWorkspaceApp, getItem } from '../router/index.js'



    export default {
        name: 'WorkspaceApp',
        computed: {
            
        ...mapGetters(['environment', 'stateWorkspace', 'stateItems', 'stateApp', 'stateItemDetail']),

        },
        data() {
            return {
                fullPage: false,
                loadedApp: null,
            }
        },
        components: {
            ItemDetail
        },
        watch: {
            $route: {
                immediate: true,
                handler(to, from) {
                    if (to.params.appId != null)
                        document.title = to.meta.title || `${this.stateApp.appName}`;
                }
            }
        },
        methods: {            //TODO: Gestionar el uso de los items relacionados por ambas partes
            async loadItem(item){
                /* let loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.loadingArea,
                    onCancel: this.onCancel,
                }); */

                this.$router.push({ name: 'item', params: { environmentNameURL: this.environment.environmentNameURL, workspaceNameURL: this.stateWorkspace.workspaceNameURL, appNameURL: this.stateApp.appNameURL, itemId: item._id } });

                /* loader.hide(); */
            },
            generateItemUrl(item) {
                // Función para generar la URL del enlace
                return `/environment/${this.environment.id}/workspace/${this.stateWorkspace.id}/app/${this.stateApp.id}/item/${item._id}`;
            },
            handleRowClick(item, event) {
                // Manejar el clic en la fila con Ctrl
                if (event.ctrlKey) {
                    const url = this.generateItemUrl(item);
                    window.open(url, '_blank'); // Abrir enlace en nueva pestaña
                } else {
                    this.loadItem(item); // Ejecutar tu función loadItem si no se presiona Ctrl
                }
            },
        },
        async beforeRouteUpdate(to, from, next){
            if(to.params.appNameURL !== from.params.appNameURL && to.params.appNameURL != null){
                this.$store.dispatch('stateItems', null)
                this.$store.dispatch('stateApp', null)
                            
                await getWorkspaceApp(to.params.appNameURL);
                if(to.params.itemId != undefined){ //Con esto gestiono cuando se intente acceder un item relacionado 
                    await getItem(to.params.itemId)//desde otra app, ya que esto supone borrar el stateItemDetail, 
                }                                  //haciendo así que el componente de item no se renderice, así que no
                next();                            //podría detectar si ha habido un cambio de url desde ahí
            } else{
                next();
            }
            
        }
    }
</script>

<style>

</style>