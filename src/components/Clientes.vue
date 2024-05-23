<template>
    <div>
      <h2>Clientes</h2>
      <form @submit.prevent="addCliente">
        <!-- depois coloco mais -->
        <input v-model="nome" placeholder="Nome">
        <!-- depois coloco mais -->
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        <li v-for="cliente in clientes" :key="cliente.id">{{ cliente.nome }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        nome: '',
        clientes: []
      }
    },
    created() {
      this.$db.collection('clientes').onSnapshot(snapshot => {
        this.clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
    },
    methods: {
      addCliente() {
        this.$db.collection('clientes').add({ nome: this.nome });
        this.nome = '';
      }
    }
  }
  </script>
  