import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

export default createStore({
  state: {
    user: null,
    appClass: null,
    environment: null,
    isAdminInCurrentEnv: null,
    stateWorkspace: null,
    stateApp: null,
    stateItems: [],
    stateItemDetail: null,
    stateNewItem: null,
    stateNewAppFormIsOpen: false,
    editingUser: null,
    stateFieldTypes: [
      {
        display: 'Text',
        value: 'string'
     }, 
     {
        display: 'Int Number',
        value: 'int'
     }, 
     { 
        display: 'Decimal Number', 
        value: 'decimal'
     }, 
     {
        display: 'Currency',
        value: 'currency'
     }, 
     {  
        display: 'Date',
        value: 'date'
     },  
     {  
        display: 'Date-Time',
        value: 'datetime'
     }, 
     { 
        display: 'Boolean',
        value: 'boolean'
     }, 
     {  
        display: 'Item Relation',
        value: 'itemRelation'
     }
    ]
  },
  getters: {
    user: (state) => {
      return state.user;
    },
    appClass: (state) => {
      return state.appClass;
    },
    environment: (state) => {
      return state.environment;
    },
    isAdminInCurrentEnv: (state) => {
      return state.isAdminInCurrentEnv;
    },
    stateWorkspace: (state) => {
      return state.stateWorkspace;
    },
    stateApp: (state) => {
      return state.stateApp;
    },
    stateItems: (state) => {
      return state.stateItems;
    },
    stateItemDetail: (state) => {
      return state.stateItemDetail;
    },
    stateNewItem: (state) => {
      return state.stateNewItem;
    },
    stateNewAppFormIsOpen: (state) => {
      return state.stateNewAppFormIsOpen;
    },
    stateFieldTypes: (state) => {
      return state.stateFieldTypes;
    },
    editingUser: (state) => {
      return state.editingUser;
    }
  },
  mutations: {
    user(state, userPayload) {
      state.user =  userPayload;
    },
    appClass(state, appClassPayload) {
      state.appClass =  appClassPayload;
    },
    environment(state, environmentPayload) {
      state.environment =  environmentPayload;
    },
    addWorkspaceToEnvironment(state, newWorkspace) {
      state.environment.workspaces.push(newWorkspace);
    },
    addAppToWorkspace(state, payload) {
      console.log(payload)
      console.log(state.environment.workspaces.find(ws => ws.id == payload.wsId))
      state.environment.workspaces.find(ws => ws.id == payload.wsId).apps.push(payload.app);
    },
    addUserToEnvironment(state, newUser) {
      state.environment.usersData.push(newUser);
    },
    isAdminInCurrentEnv(state, isAdminPayload) {
      state.isAdminInCurrentEnv =  isAdminPayload;
    },
    stateWorkspace(state, workspacePayload) {
      state.stateWorkspace =  workspacePayload;
    },
    stateApp(state, appPayload) {
      state.stateApp =  appPayload;
    },
    stateItems(state, itemsPayload) {
      state.stateItems =  itemsPayload;
    },
    stateItemDetail(state, itemDetailPayload) {
      state.stateItemDetail =  itemDetailPayload;
    },
    stateNewItem(state, newItemPayload) {
      state.stateNewItem =  newItemPayload;
    },
    updateItem(state, itemUpdatePayload) {
      state.stateItems.find(item => item._id == itemUpdatePayload._id);
    },
    stateNewAppFormIsOpen(state, newAppPayloadIsOpen) {
      state.stateNewAppFormIsOpen =  newAppPayloadIsOpen;
    },
    stateFieldTypes(state, stateFieldTypesPayload) {
      state.stateFieldTypes =  stateFieldTypesPayload;
    },
    editingUser(state, stateFieldTypesPayload) {
      state.editingUser =  stateFieldTypesPayload;
    }
  },
  actions: {
    user(context, user) {
      context.commit('user', user);
    },
    appClass(context, appClass) {
      context.commit('appClass', appClass);
    },
    environment(context, environment) {
      context.commit('environment', environment);
    },
    addWorkspaceToEnvironment(context, addWorkspaceToEnvironment) {
      context.commit('addWorkspaceToEnvironment', addWorkspaceToEnvironment);
    },
    addAppToWorkspace(context, newAppInfo) {
      context.commit('addAppToWorkspace', newAppInfo);
    },    
    addUserToEnvironment(context, newUserInfo) {
      context.commit('addUserToEnvironment', newUserInfo);
    },
    isAdminInCurrentEnv(context, isAdminInCurrentEnv) {
      context.commit('isAdminInCurrentEnv', isAdminInCurrentEnv);
    },
    stateWorkspace(context, stateWorkspace) {
      context.commit('stateWorkspace', stateWorkspace);
    },
    stateApp(context, stateApp) {
      context.commit('stateApp', stateApp);
    },
    stateItems(context, stateItems) {
      context.commit('stateItems', stateItems);
    },
    stateItemDetail(context, stateItemDetail) {
      context.commit('stateItemDetail', stateItemDetail);
    },
    stateNewItem(context, stateNewItem) {
      context.commit('stateNewItem', stateNewItem);
    },
    updateItem(context, updateItem) {
      context.commit('updateItem', updateItem);
    },
    stateNewAppFormIsOpen(context, stateNewAppFormIsOpen) {
      context.commit('stateNewAppFormIsOpen', stateNewAppFormIsOpen);
    },
    stateFieldTypes(context, stateFieldTypes) {
      context.commit('stateFieldTypes', stateFieldTypes);
    },
    editingUser(context, editingUser) {
      context.commit('editingUser', editingUser);
    }
  },
  plugins: [
    new VuexPersistence({
      storage: window.localStorage,
      reducer: (state) => ({user: state.user, environment: state.environment})
    }).plugin
  ]
  
})
