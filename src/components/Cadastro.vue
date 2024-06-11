<template>
  <div class="container">
    <h2>Cadastro</h2>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Senha" required>
      <button type="submit">Cadastrar</button>
      <p>Já tem uma conta? <router-link to="/login">Entrar</router-link></p>
    </form>
  </div>
</template>

<script>
import { auth } from '../main';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/login');
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
      }
    }
  }
};
</script>
