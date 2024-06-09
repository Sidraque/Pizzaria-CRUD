<template>
  <div id="app">
    <nav v-if="user">
      <router-link to="/clientes">Clientes</router-link> |
      <router-link to="/produtos">Produtos</router-link> |
      <router-link to="/pedidos">Pedidos</router-link> |
      <button @click="logout">Desconectar</button>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './main';

export default {
  name: 'App',
  data() {
    return {
      user: null
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  },
  methods: {
    async logout() {
      try {
        await signOut(auth);
        this.$router.push('/login');
      } catch (error) {
        console.error('Erro ao desconectar:', error);
      }
    }
  }
}
</script>

<style>
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
}
button {
  cursor: pointer;
}
</style>
