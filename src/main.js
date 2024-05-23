import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Vue from 'vue';
import App from './App.vue';
import router from './router';

const firebaseConfig = {
  apiKey: "AIzaSyD8Z7AA5B5QRLxVkSvbqyNUAN5ofwPAVa8",
  authDomain: "pizzaria-crud.firebaseapp.com",
  projectId: "pizzaria-crud",
  storageBucket: "pizzaria-crud.appspot.com",
  messagingSenderId: "1069015868955",
  appId: "1:1069015868955:web:9d7633690172f875197abe",
  measurementId: "G-V8KXXS05YS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

Vue.prototype.$db = db;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
