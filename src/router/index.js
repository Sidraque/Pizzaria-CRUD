import { createRouter, createWebHistory } from "vue-router";
import Cadastro from "../components/Cadastro.vue";
import ClienteDetalhes from "../components/ClienteDetalhes.vue";
import Clientes from "../components/Clientes.vue";
import Login from "../components/Login.vue";
import Pedidos from "../components/Pedidos.vue";
import Produtos from "../components/Produtos.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/cadastro", component: Cadastro },
  { path: "/clientes/:id", name: "ClienteDetalhes", component: ClienteDetalhes, props: true },
  { path: "/clientes", component: Clientes },
  { path: "/pedidos", component: Pedidos },
  { path: "/produtos", component: Produtos },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
