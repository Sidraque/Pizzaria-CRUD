<template>
    <div>
      <h2>Cadastro</h2>
      <input v-model="email" placeholder="Email">
      <input v-model="password" placeholder="Senha" type="password">
      <button @click="register">Cadastrar</button>
      <p>Já tem uma conta? <router-link to="/login">Entrar</router-link></p>
    </div>
  </template>
  
  <script>
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../main';
  
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
          alert('Falha no cadastro: ' + error.message);
        }
      }
    }
  }
  </script>
  