import { createRouter, createWebHistory } from 'vue-router';
import Clientes from '../components/Clientes.vue';
import Login from '../components/Login.vue';
//import Pedidos from '../components/Pedidos.vue';
//import Produtos from '../components/Produtos.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/clientes', component: Clientes },
  //{ path: '/pedidos', component: Pedidos },
  //{ path: '/produtos', component: Produtos }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
