<template>
    <div>
      <h2>Pedidos</h2>
      <form @submit.prevent="addPedido">
        <select v-model="clienteId">
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">{{ cliente.nome }}</option>
        </select>
        <select v-model="produtoId">
          <option v-for="produto in produtos" :key="produto.id" :value="produto.id">{{ produto.nome }}</option>
        </select>
        <input v-model="quantidade" placeholder="Quantidade" type="number">
        <input v-model="total" placeholder="Total" type="number">
        <input v-model="dataPedido" placeholder="Data do Pedido" type="date">
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        <li v-for="pedido in pedidos" :key="pedido.id">{{ pedido.clienteNome }} - {{ pedido.produtoNome }} - {{ pedido.total }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        clienteId: '',
        produtoId: '',
        quantidade: 1,
        total: 0,
        dataPedido: '',
        pedidos: [],
        clientes: [],
        produtos: []
      }
    },
    created() {
      this.$db.collection('clientes').onSnapshot(snapshot => {
        this.clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
      this.$db.collection('produtos').onSnapshot(snapshot => {
        this.produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
      this.$db.collection('pedidos').onSnapshot(snapshot => {
        this.pedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
    },
    methods: {
      addPedido() {
        const cliente = this.clientes.find(cliente => cliente.id === this.clienteId);
        const produto = this.produtos.find(produto => produto.id === this.produtoId);
        this.$db.collection('pedidos').add({
          clienteId: this.clienteId,
          produtoId: this.produtoId,
          quantidade: this.quantidade,
          total: this.total,
          dataPedido: this.dataPedido,
          clienteNome: cliente ? cliente.nome : '',
          produtoNome: produto ? produto.nome : ''
        });
        this.clienteId = '';
        this.produtoId = '';
        this.quantidade = 1;
        this.total = 0;
        this.dataPedido = '';
      }
    }
  }
  </script>
  