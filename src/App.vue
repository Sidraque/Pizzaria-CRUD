<template>
  <div id="app">
    <nav v-if="user" class="navbar">
      <router-link to="/clientes" class="nav-link">Clientes</router-link>
      <router-link to="/produtos" class="nav-link">Produtos</router-link>
      <router-link to="/pedidos" class="nav-link">Pedidos</router-link>
      <button @click="logout" class="nav-button">Desconectar</button>
    </nav>
    <div class="main-content">
      <router-view/>
    </div>
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
.navbar {
  background-color: #333;
  padding: 7px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.nav-link {
  color: white;
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline;
}

.nav-button {
  padding: 10px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #c82333;
}

.main-content {
  margin-top: 50px;
  padding: 20px;
}
</style>
