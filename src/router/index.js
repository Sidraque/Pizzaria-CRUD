import { createRouter, createWebHistory } from 'vue-router';
import BuscaCEP from '../components/BuscaCEP.vue';
import Clientes from '../components/Clientes.vue';
import Login from '../components/Login.vue';
import Pedidos from '../components/Pedidos.vue';
import Produtos from '../components/Produtos.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/clientes', component: Clientes },
  { path: '/busca-cep', component: BuscaCEP },
  { path: '/produtos', component: Produtos },
  { path: '/pedidos', component: Pedidos }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
