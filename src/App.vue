<template>
  <div id="app">
    <nav>
      <router-link to="/">Login</router-link> |
      <router-link to="/clientes">Clientes</router-link> |
      <router-link to="/produtos">Produtos</router-link> |
      <router-link to="/pedidos">Pedidos</router-link>
    </nav>
    
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
}
</style>
