import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Cadastro from '../components/Cadastro.vue';
import ClienteDetalhes from '../components/ClienteDetalhes.vue';
import Clientes from '../components/Clientes.vue';
import BuscaCEP from '../components/BuscaCEP.vue';
import Produtos from '../components/Produtos.vue';
import Pedidos from '../components/Pedidos.vue';
import { auth } from '../main';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  {
    path: '/clientes',
    component: Clientes,
    meta: { requiresAuth: true }
  },
  { path: '/clientes/:id', 
    component: ClienteDetalhes, 
    props: true 
  },
  {
    path: '/busca-cep',
    component: BuscaCEP,
    meta: { requiresAuth: true }
  },
  {
    path: '/produtos',
    component: Produtos,
    meta: { requiresAuth: true }
  },
  {
    path: '/pedidos',
    component: Pedidos,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.currentUser) {
      next({ path: '/login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
