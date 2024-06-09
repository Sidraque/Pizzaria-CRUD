<template>
  <div>
    <h2>Pedidos</h2>
    <form @submit.prevent="addPedido">
      <select v-model="clienteId" required>
        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">{{ cliente.nome }}</option>
      </select>
      <select v-model="produtoId" required>
        <option v-for="produto in produtos" :key="produto.id" :value="produto.id">{{ produto.nome }}</option>
      </select>
      <input v-model="quantidade" placeholder="Quantidade" type="number" required>
      <input v-model="total" placeholder="Total" type="number" required>
      <input v-model="dataPedido" placeholder="Data do Pedido" type="date" required>
      <button type="submit">Adicionar</button>
    </form>
    <ul>
      <li v-for="pedido in pedidos" :key="pedido.id">{{ pedido.clienteNome }} - {{ pedido.produtoNome }} - R$ {{ pedido.total }}</li>
    </ul>
  </div>
</template>

<script>
import { db } from '../main';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

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
    const clientesCollection = collection(db, 'clientes');
    onSnapshot(clientesCollection, (snapshot) => {
      this.clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });

    const produtosCollection = collection(db, 'produtos');
    onSnapshot(produtosCollection, (snapshot) => {
      this.produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });

    const pedidosCollection = collection(db, 'pedidos');
    onSnapshot(pedidosCollection, (snapshot) => {
      this.pedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  },
  methods: {
    async addPedido() {
      const pedidosCollection = collection(db, 'pedidos');
      const cliente = this.clientes.find(cliente => cliente.id === this.clienteId);
      const produto = this.produtos.find(produto => produto.id === this.produtoId);
      try {
        await addDoc(pedidosCollection, {
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
      } catch (error) {
        console.error('Erro ao adicionar pedido:', error);
      }
    }
  }
}
</script>
