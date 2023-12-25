<template>
    <Teleport to="body">
        <div id="newAppFormSection">
            <form id="newAppForm" class="container-fluid p-0" @submit.prevent="createApp()">
                <div id="itemDetailNav" class="d-flex justify-content-between flex-row-reverse"><fa icon="fa-solid fa-xmark" @click="closeNewAppForm()"/></div>
                <input id="newAppName" type="text" placeholder="New App..." v-model="newAppName">
                <div class="container-fluid w-100 p-0">
                    <div class="d-flex justify-content-between newAppHeaders">
                        <p class="w-30 text-center my-0">Field names</p>
                        <p class="w-70 my-0" style="padding-left: 1.5rem">Select field's type</p>
                    </div>
                    <div class="d-flex justify-content-between newAppField new-app-field-animation" v-for="(appField, index) in appFields" style="flex-wrap: wrap;" :id="`newAppField-${index}`">
                        <div class="w-30 d-flex pe-2" style="align-items: center; justify-content: end;">
                            <fa icon="fa-solid fa-circle-minus" v-if='index > 0' class="w-20" style="color: #ff4d4d;" @click="removeField(index, $event)"/>
                            <input :title="appField.Name" class="w-80 text-end px-0 newAppFieldName h-100" placeholder="New Field..." required type="texts" v-model="appField.Name" onkeydown="return /[a-z0-9  ]/i.test(event.key)">
                        </div>
                        <div class="w-70 newAppFieldType">
                            <select  v-model="appField.Type" required>
                                <option v-for="typeOption in stateFieldTypes" :value="typeOption.value"> {{ typeOption.display }} </option>            
                            </select>
                        </div>
                        <div class="d-flex justify-content-center" style="flex-basis: 100%; margin-left: 30%;" v-if="appField.Type == 'itemRelation'" >
                            <select class="w-70 py-2 newAppFieldType" v-model="appField['AppRelationId']" required>
                                <option v-for="app in stateWorkspace.apps" :value="app.id"> {{ app.appName }} </option>            
                            </select>
                        </div>
                    </div>
                    <div id="addField"><fa icon="fa-solid fa-plus" @click="addField()"/></div>
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
        name: 'NewAppForm',
        computed: {
            
        ...mapGetters(['stateWorkspace', 'stateNewAppFormIsOpen', 'stateApp', 'stateItemDetail', 'stateFieldTypes', 'environment']),
        appFields: function() {

            return this.newAppFields;
        }

        },
        data() {
            return {
                fullPage: false,
                loadedApp: null,
                newAppFields: [
                    {
                        Name: '',
                        NameAsProperty: '',
                        Type: ''
                    }
                ],
                newAppName: ""
            }
        },
        watch: {
            $route: {
                immediate: true,
                handler(to, from) {
                    document.title = to.meta.title || `${this.stateWorkspace.workspaceName}`;
                }
            }
        },
        async mounted() {
            window.addEventListener('click', this.handleClickOutsideOfAppForm);
        },
        methods: {
            async closeNewAppForm() {
                this.$router.push({ name: 'workspace', params: { id: this.environment.id, wsId: this.stateWorkspace.id } });
                
            },
            async handleClickOutsideOfAppForm(e) {
                e.stopPropagation();
                if ('newAppFormSection' == e.target.id){
                    this.closeNewAppForm();
                }
            },
            async goBack() {
                this.$store.dispatch('stateItemDetail', null);
                this.$router.go(-1);
            },
            async addField() {
                let lastField = this.newAppFields[this.newAppFields.length - 1];
                let appField = document.getElementsByClassName('newAppField')[0];
                let lastFieldHtmlName = Array.from(document.querySelectorAll(".newAppFieldName")).pop();
                let lastFieldHtmlType = Array.from(document.querySelectorAll(".newAppFieldType")).pop();
                let createButton = document.getElementById('createAppButton');

                let styles = window.getComputedStyle(appField)
                let transitionHeight = Math.ceil(appField.offsetHeight  + parseFloat(styles['marginTop'])  );
                createButton.style.transition = 'transform .3s ease-in-out'
                createButton.style.transform = `translateY(${transitionHeight}px)`
                setTimeout(() => {
                
                    if (lastField.Name == "") {
                        lastFieldHtmlName.classList.add('newAppIncorrectFieldName');
                        lastFieldHtmlName.placeholder = "Insert name";
                    } 
                    if(lastField.Type == ""){
                        lastFieldHtmlType.classList.add('newAppIncorrectFieldType');
                    }
                    if(lastField.Name != "" && lastField.Type != "") {
                        lastFieldHtmlName.classList.remove('newAppIncorrectFieldName');
                        lastFieldHtmlType.classList.remove('newAppIncorrectFieldType');
                        let newAppfield = {
                            Name: '',
                            Type: ''
                        }
                        this.newAppFields.push(newAppfield);
                        createButton.style.transition = 'none'
                        createButton.style.transform = `translateY(0)`
                    } else {
                        createButton.style.transform = `translateY(0)`
                    }

                    
                }, 300);
            },
            async removeField(indexField, event) {
                let field = event.target;

                while (field && !field.classList.contains('newAppField')) {
                    field = field.parentNode;
                }

                if (this.newAppFields[indexField].Type == 'itemRelation') {
                    field.style.animation = 'fade-out-x2 1s';
                } else {
                    field.style.animation = 'fade-out 1s';
                }




                let createButton = document.getElementById('createAppButton');
                let appField = document.getElementsByClassName('newAppField')[0];
                let styles = window.getComputedStyle(appField)
                let transitionHeight = Math.ceil(appField.offsetHeight + parseFloat(styles['marginTop']) );
                
                setTimeout(() => {

                    setTimeout(() => {

                        this.newAppFields.splice(indexField, 1)

                        document.querySelectorAll('.newAppField').forEach((field) => {
                            field.style.animation = 'none !important'
                        })

                        console.log(document.getElementsByClassName('newAppField'))
                        field.style.marginLeft = '0%';
                        
                    }, 500)
                        
                }, 500)
            },
            async createApp() {
                /* let loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.loadingArea,
                    onCancel: this.onCancel,
                }); */

                let appName = document.getElementById('newAppName');

                if(this.newAppName == "") {
                    appName.classList.add('newAppIncorrectFieldName')
                } else {
                    console.log(this.newAppFields);
                    var newAppRelationFields = [];
                    var newAppSimpleFields = this.newAppFields.filter((field) => field.Type != 'itemRelation');
                    this.newAppFields.forEach((field) => {

                        field.NameAsProperty = field.Name.toLowerCase().replace(/ /g,"_");

                        if (field.Type == 'itemRelation') {
                            newAppRelationFields.push(field);
                        }
                    
                    });

                    console.log(this.newAppFields)
                    console.log(newAppRelationFields)
                    console.log(newAppSimpleFields)

                    await axios.post(`app/add-to/${this.stateWorkspace.id}`, {
                        AppName: this.newAppName,
                        Fields: newAppSimpleFields,
                        FieldsRelation: newAppRelationFields
                    })
                    .then( (response) => {
                        console.log(response)
                        var app = response.data;
                        var wsId = this.stateWorkspace.id
                        this.$store.dispatch('addAppToWorkspace', {app, wsId});

                    });

                    this.closeNewAppForm();
                }
                /* loader.hide(); */
            }
        }
    }
</script>

<style>

</style>