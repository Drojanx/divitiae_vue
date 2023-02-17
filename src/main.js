import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './axios'
import './styles.scss'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA-80mIOsWvMPSeIx7wewM0nThnnVkXeI",
  authDomain: "divitiae-app.firebaseapp.com",
  projectId: "divitiae-app",
  storageBucket: "divitiae-app.appspot.com",
  messagingSenderId: "791250432045",
  appId: "1:791250432045:web:9ad212e7b236b1286988a4"
};

initializeApp(firebaseConfig);

const app = createApp(App);
app.use(store).use(router).mount('#app')
