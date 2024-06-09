<template>
  <div>
    <h2>Login</h2>
    <input v-model="email" placeholder="Email">
    <input v-model="password" placeholder="Senha" type="password">
    <button @click="login">Entrar</button>
    <p>Não tem uma conta? <router-link to="/cadastro">Cadastre-se</router-link></p>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../main';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/clientes');
      } catch (error) {
        alert('Falha no login: ' + error.message);
      }
    }
  }
}
</script>
