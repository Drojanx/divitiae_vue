import HomeView from '../views/HomeView.vue'
import PageNotFoundView from '../views/PageNotFoundView.vue'
import EnvironmentView from '../views/EnvironmentView.vue'
import EnvironmentConfigView from '../views/EnvironmentConfigView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import RootView from '../views/RootView.vue'
import ForgotView from '../views/ForgotView.vue'
import Workspace from '../components/Workspace.vue'
import PageNotFound from '../components/NotFound/PageNotFound.vue'
import EnvironmentNotFound from '../components/NotFound/EnvironmentNotFound.vue'
import WorkspaceNotFound from '../components/NotFound/WorkspaceNotFound.vue'
import AppNotFound from '../components/NotFound/AppNotFound.vue'
import AddUserForm from '../components/AddUser.vue'
import NewItem from '../components/NewItem.vue'
import WorkspaceApp from '../components/WorkspaceApp.vue'
import ItemDetail from '../components/ItemDetail.vue'
import NewAppForm from '../components/NewAppForm.vue'
import UserInfo from '../components/UserInfo.vue'
import LogOutView from '../views/LogOutView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios';
import createStore from '../store/index.js';
import { useLoading } from 'vue-loading-overlay';

const { loading, show, hide } = useLoading();

// Función de comprobación de autenticación
function checkAuthentication(to, from, next) {
  const token = localStorage.getItem('token');
  const requiresAuth = to.meta.requiresAuth;
  console.log("auth")
  if (requiresAuth && !token) {
    // Si la ruta requiere autenticación y el usuario no está logueado, redireccionar a '/login'
    next('/login');
  } else if (!requiresAuth && token && to.fullPath != '/page-not-found') {
    // Si la ruta no requiere autenticación y el usuario está logueado, redireccionar a '/home'
    next('/home');
  } else {
    // En cualquier otro caso, permitir que el usuario acceda a la ruta solicitada
    next();
  }
}



function checkAdminPermissions(to, from, next) {
  const envId = to.params.id;
  const requiresAdmin = to.meta.requiresAdmin;
  const userId = createStore.getters.user.userId;
  var isAdmin = createStore.getters.environment.usersData.find(role => role.userId == userId).isAdmin;

  if (requiresAdmin && !isAdmin) {
    next('/home');
  } else {
    next();
  }  
}

async function getEnvironment(environmentNameURL, to, next) {
  var we = createStore.getters.user.workEnvironments.find(we => we.environmentNameURL == environmentNameURL);
  let loader = show({
    color: "#ffc107",
    width: 80,
    height: 80
  });
  if (we == undefined) {
    loader.hide();
    createStore.dispatch('environment', null);
    createStore.dispatch('isAdminInCurrentEnv', null);
    console.log(to.path.substring(1).split("/"))
    router.push({
      name: 'environment-not-found',
      params: { pathMatch: to.path.substring(1).split("/")},
      query: to.query,
      hash: to.hash
    })
  } else {
  
    await axios
      .get(`environment/${we.id}`)
      .then((response) => {
        // Aquí podrías hacer algunas validaciones adicionales con la respuesta de la API si es necesario
        // Redirigir al usuario a la vista "Environment" y pasar los datos de la respuesta como parámetros
        var env = response.data.weData;
        env.environmentNameURL = we.environmentNameURL;
        let existingNames = {};
        env.workspaces.forEach((ws) => {
          let nombreUrlFriendly = ws.workspaceName.toLowerCase().replace(/ /g, "-").replace(/[^a-zA-Z0-9-]/g, "");
          
          // Verifica si ya existe el nombreUrlFriendly
          if (existingNames[nombreUrlFriendly] !== undefined) {
              // Genera un nuevo nombre único
              let count = existingNames[nombreUrlFriendly]++;
              nombreUrlFriendly += `(${count})`;
          } else {
            existingNames[nombreUrlFriendly] = 1;
          }
          
          ws.workspaceNameURL = nombreUrlFriendly;

          let existingAppNames = {}
          ws.apps.forEach((app) => {
            let nombreAppUrlFriendly = app.appName.toLowerCase().replace(/ /g, "-").replace(/[^a-zA-Z0-9-]/g, "");
          
            // Verifica si ya existe el nombreUrlFriendly
            if (existingAppNames[nombreAppUrlFriendly] !== undefined) {
                // Genera un nuevo nombre único
                let count = existingNames[nombreAppUrlFriendly]++;
                nombreAppUrlFriendly += `(${count})`;
            } else {
              existingAppNames[nombreAppUrlFriendly] = 1;
            }

            app.appNameURL = nombreAppUrlFriendly;
          })
        });

        createStore.dispatch('environment', env);
        createStore.dispatch('isAdminInCurrentEnv', we.isAdmin);
        
        loader.hide();
      })
      .catch((error) => {
        console.error('Error al obtener detalles del entorno:', error);
        // Redireccionar a otra página en caso de error, por ejemplo:
        router.push('/error');
      });
  }
}

async function getWorkspace(workspaceNameURL, to){
  let loader = show({
    color: "#ffc107",
    width: 80,
    height: 80
  });
    if(createStore.getters.environment) {
      var currentWs = createStore.getters.environment.workspaces.find(ws => ws.workspaceNameURL == workspaceNameURL);
      console.log(to.params)
      if (currentWs == undefined){
        router.push({
          name: 'workspace-not-found',
          params: { pathMatch: to.path.substring(1).split("/")},
          query: to.query,
          hash: to.hash
        })
      } else {
        createStore.dispatch('stateWorkspace', currentWs);
        createStore.dispatch('stateApp', null);
        createStore.dispatch('stateItems', []);
      }
    }
  loader.hide();
}

async function getWorkspaceApp(appNameURL, to){
  let loader = show({
    color: "#ffc107",
    width: 80,
    height: 80
  });
  var loadedItems = [];
  if (createStore.getters.stateWorkspace) {
    var loadedApp = createStore.getters.stateWorkspace.apps.find(app => app.appNameURL == appNameURL);
    
    if (loadedApp == undefined) {
      router.push({
        name: 'app-not-found',
        params: { pathMatch: to.path.substring(1).split("/")},
        query: to.query,
        hash: to.hash
      })
    } else {
      createStore.dispatch('stateApp', loadedApp);
      await axios.get(`app/${loadedApp.id}/item/all`)
        .then((response) => {
    
          response.data.forEach((item) => {
                let fixedItem = {
                    _id: '',
                    _descriptiveName: '',
                    fields: {},
                    relationFields: {},
                    relatedItemsByAppId: {}
                }
                var fixedValues = {};
                var fixedRelationValues = {};
                item.fieldsValue.forEach((value) => {
    
                    if (value.type == "date") {
                      let date = new Date(value.value * 1000);
                      const offset = date.getTimezoneOffset();
                      date = new Date(date.getTime() - (offset*60*1000));
                      fixedValues[`${value.nameAsProperty}`] = date.toISOString().split('T')[0];
                    } else {
                      fixedValues[`${value.nameAsProperty}`] = value.value;
                    }
    
    
                })
    
                item.fieldsRelationValue.forEach((relationValue) => {
                  fixedRelationValues[`${relationValue.nameAsProperty}`] = relationValue.value;
                })
    
                fixedItem._id = item.id.toString();
                fixedItem._descriptiveName = item.descriptiveName;
                fixedItem.fields = fixedValues;
                fixedItem.relationFields = fixedRelationValues;
    
                                            
                item.relatedItems.forEach((relatedItem) => {
                    
    
                    const { relatedAppId } = relatedItem;
    
                    var relatedAppName = createStore.getters.stateWorkspace.apps.find((app) => app.id == relatedItem.relatedAppId).appName;
                    
                    if (!fixedItem.relatedItemsByAppId[relatedAppId]) {
                        // Si la lista para 'relatedAppId' no existe, crea una nueva.
                        fixedItem.relatedItemsByAppId[relatedAppId] = {};
                        fixedItem.relatedItemsByAppId[relatedAppId]['relatedItems'] = [];
                    }
    
                    fixedItem.relatedItemsByAppId[relatedAppId]['relatedAppName'] = relatedAppName
                    
                    var fixedRelatedItem = {
                        relatedItemId: relatedItem.relatedItemId,
                        relatedItemName: relatedItem.relatedItemName
                    }
                    fixedItem.relatedItemsByAppId[relatedAppId]['relatedItems'].push(fixedRelatedItem);
                });
    
                loadedItems.push(fixedItem);
    
            });
            createStore.dispatch('stateItems', loadedItems);
        }); 
    }
    
  }
  loader.hide();

}

async function getItem(itemId){
  let item = createStore.getters.stateItems.find(item => item._id == itemId);
  createStore.dispatch('stateItemDetail', item);

}

async function newItemForm() {
  let app = createStore.getters.stateApp;

  let newItem = {
    _descriptiveName: ""
  }

  app.fields.forEach((field) => {
    newItem[field.nameAsProperty] = ""
  })
  console.log(newItem)
  console.log(app)
  createStore.dispatch('stateNewItem', newItem);
}

async function getUserPermissionsOnWorkEnvironment(userId, environmentNameURL) {
  let loader = show({
    color: "#ffc107",
    width: 80,
    height: 80
  });
  var we = createStore.getters.user.workEnvironments.find(we => we.environmentNameURL == environmentNameURL);
  await axios
    .get(`user/permissions/${userId}/environment/${we.id}`)
    .then((res) => {
      var resWe = res.data.userData.workEnvironments.find(resWe => resWe.id == we.id);
      var fixedWe = {
        environmentName: resWe.environmentName,
        id: resWe.id,
        isAdmin: resWe.isAdmin,
        workspaces: {}
      }
      we.workspaces.forEach(ws => {
        var resWs = resWe.workspaces.find(resWs => resWs == ws);
        if (resWs == undefined) {
          fixedWe.workspaces[ws] = false;
        } else {
          fixedWe.workspaces[ws] = true;
        }
      })

      var editingUserInfo = {
        userEmail: res.data.userData.userEmail,
        userId: res.data.userData.userId,
        userLastName: res.data.userData.userLastName,
        userName: res.data.userData.userName,
        workEnvironment: fixedWe
      }
      createStore.dispatch('editingUser', editingUserInfo);
    })
  loader.hide();  
}


const routes = [
  {
    path: '/',
    name: 'root',
    component: RootView,
    meta: { requiresAuth: false }, // Esta ruta no requiere autenticación
    beforeEnter: checkAuthentication
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }, // Esta ruta requiere autenticación
    beforeEnter: checkAuthentication
  },
  {
    path: '/environment/:pathMatch(.*)*',
    name: 'environment-not-found',
    component: EnvironmentNotFound,
    meta: { requiresAuth: true }, // Esta ruta requiere autenticación
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'workspace-not-found',
    component: WorkspaceNotFound,
    meta: { requiresAuth: true }, // Esta ruta requiere autenticación        
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'app-not-found',
    component: AppNotFound,
    meta: { requiresAuth: true }, // Esta ruta requiere autenticación        
  },
  {
    path: '/environment/:environmentNameURL',
    name: 'environment',
    component: EnvironmentView,
    meta: { requiresAuth: true }, // Esta ruta requiere autenticación
    beforeEnter: async  (to, from) => {
      checkAuthentication;
      const environmentNameURL = to.params.environmentNameURL;
      await getEnvironment(environmentNameURL, to);      
    },
    children: [      
      {
        path: ':workspaceNameURL',
        name: 'workspace',
        meta: { requiresAuth: true }, // Esta ruta requiere autenticación
        component: Workspace,
        beforeEnter: async  (to, from) => {
          checkAuthentication;
          const environmentNameURL = to.params.environmentNameURL;
          const workspaceNameURL = to.params.workspaceNameURL;
          if (!createStore.getters.environment){
            await getEnvironment(environmentNameURL, to);
          }
          
          await getWorkspace(workspaceNameURL, to);          
        },
        children: [
          {
            path: 'new-app-form',
            name: 'new-app-form',
            meta: { requiresAuth: true }, // Esta ruta requiere autenticación
            component: NewAppForm,
            beforeEnter: async  (to, from) => {
              checkAuthentication;
              const environmentNameURL = to.params.environmentNameURL;
              const workspaceNameURL = to.params.workspaceNameURL;
              if (!createStore.getters.environment){
                await getEnvironment(environmentNameURL, to);
              }
              
              await getWorkspace(workspaceNameURL, to);
    
            }
          },
          {
            path: ':appNameURL',
            name: 'app',
            meta: { requiresAuth: true }, // Esta ruta requiere autenticación
            component: WorkspaceApp,
            beforeEnter: async  (to, from) => {
              checkAuthentication;
              const environmentNameURL = to.params.environmentNameURL;
              const workspaceNameURL = to.params.workspaceNameURL;
              const appNameURL = to.params.appNameURL;
              if (!createStore.getters.stateWorkspace){
                if (!createStore.getters.environment){
                  await getEnvironment(environmentNameURL, to);
                }              
                await getWorkspace(workspaceNameURL, to);
              }

              await getWorkspaceApp(appNameURL, to)
            },
            children: [
              {
                path: 'item/:itemId',
                name: 'item',
                meta: { requiresAuth: true },
                component: ItemDetail,
                beforeEnter: async (to, from, next) => {
                  checkAuthentication;
                  const environmentNameURL = to.params.environmentNameURL;
                  const workspaceNameURL = to.params.workspaceNameURL;
                  const appNameURL = to.params.appNameURL;
                  const itemId = to.params.itemId;
                  if (!createStore.getters.ItemDetail){
                    if (!createStore.getters.stateWorkspace){
                      if (!createStore.getters.environment){
                        await getEnvironment(environmentNameURL, to);
                      }                      
                      await getWorkspace(workspaceNameURL, to);
                    }
                    await getWorkspaceApp(appNameURL, to)
                  }
                  await getItem(itemId, to);
                  next();
                }
              },
              {
                path: 'new-item',
                name: 'new-item',
                meta: { requiresAuth: true },
                component: NewItem,
                beforeEnter: async (to, from, next) => {
                  checkAuthentication;
                  const environmentNameURL = to.params.environmentNameURL;
                  const workspaceNameURL = to.params.workspaceNameURL;
                  const appNameURL = to.params.appNameURL;
                  if (!createStore.getters.ItemDetail){
                    if (!createStore.getters.stateWorkspace){
                      if (!createStore.getters.environment){
                        await getEnvironment(environmentNameURL, to);
                      }                      
                      await getWorkspace(workspaceNameURL, to);
                    }
                    await getWorkspaceApp(appNameURL, to)
                  }
                  await newItemForm();
                  next();
                }
              }
            ]
          }
        ]
      }
    ]    
    
  },
  {
    path: '/environment/:environmentNameURL/configuration',
    name: 'environmentConfigView',
    component: EnvironmentConfigView,
    meta: { requiresAuth: true, requiresAdmin: true }, // Esta ruta requiere autenticación
    beforeEnter: async  (to, from, next) => {
      checkAuthentication;
      checkAdminPermissions;
      const environmentNameURL = to.params.environmentNameURL;
      await getEnvironment(environmentNameURL, to);
      next();
    },
    children: [ 
      {
        path: '/environment/:environmentNameURL/configuration/add-user',
        name: 'environmentAddUserView',
        component: AddUserForm,
        meta: { requiresAuth: true, requiresAdmin: true }, // Esta ruta requiere autenticación
        beforeEnter: async (to, from, next) => {
          checkAuthentication;
          checkAdminPermissions;
          const environmentNameURL = to.params.environmentNameURL;
          if (!createStore.getters.environment){
            await getEnvironment(environmentNameURL, to);
          }
          next();
        }
      },
      {
        path: '/environment/:environmentNameURL/configuration/edit-user/:userId',
        name: 'edit-user',
        component: UserInfo,
        meta: { requiresAuth: true, requiresAdmin: true }, // Esta ruta requiere autenticación
        beforeEnter: async (to, from, next) => {
          checkAuthentication;
          checkAdminPermissions;
          const environmentNameURL = to.params.environmentNameURL;
          const userId = to.params.userId;

          await getUserPermissionsOnWorkEnvironment(userId, environmentNameURL);

          next();
        }
      }
    ]
  },
  {
   
    
  },/* 
  {
    path: '/:NotFound(.*)*',
    name: 'page-not-found',
    component: PageNotFound,
    beforeEnter: () => {
      console.log("page")
    }
  }, */
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: PageNotFound,
    beforeEnter: () => {
      console.log("item")
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }, // Esta ruta no requiere autenticación
    beforeEnter: checkAuthentication
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: { requiresAuth: false }, // Esta ruta no requiere autenticación
    beforeEnter: checkAuthentication
  },
  {
    path: '/forgot',
    name: 'forgot',
    component: ForgotView,
    meta: { requiresAuth: false }, // Esta ruta no requiere autenticación
    beforeEnter: checkAuthentication,
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogOutView,
    meta: { requiresAuth: false } // Esta ruta no requiere autenticación
    
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})  


/*  router.beforeEach(async (to, from, next) => {
  let loader = show();
  console.log(to.name)
  if (!router.hasRoute(to.name)) {
    loader.hide(); 
    return {
      name: 'page-not-found',
      params: { pathMatch: to.path.substring(1).split("/") },
      query: to.query,
      hash: to.hash
    }
  }

  loader.hide();  

  next();
}); */
export {router, getWorkspaceApp, getWorkspace, getEnvironment, getItem}
