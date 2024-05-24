<template>
    <div>
      <h2>Produtos</h2>
      <form @submit.prevent="addProduto">
        <input v-model="nome" placeholder="Nome">
        <input v-model="preco" placeholder="Preço" type="number">
        <select v-model="categoria">
          <option>Pizza</option>
          <option>Bebida</option>
          <option>Sobremesa</option>
        </select>
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        <li v-for="produto in produtos" :key="produto.id">{{ produto.nome }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        nome: '',
        preco: 0,
        categoria: '',
        produtos: []
      }
    },
    created() {
      this.$db.collection('produtos').onSnapshot(snapshot => {
        this.produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
    },
    methods: {
      addProduto() {
        this.$db.collection('produtos').add({
          nome: this.nome,
          preco: this.preco,
          categoria: this.categoria
        });
        this.nome = '';
        this.preco = 0;
        this.categoria = '';
      }
    }
  }
  </script>
  