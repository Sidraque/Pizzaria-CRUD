<template>
  <div>
    <h2>Pedidos</h2>
    <form @submit.prevent="addPedido">
      <select v-model="clienteId" required>
        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">{{ cliente.nome }}</option>
      </select>
      <select v-model="produtoId" @change="updateProdutoSelecionado" required>
        <option v-for="produto in produtos" :key="produto.id" :value="produto.id">{{ produto.nome }}</option>
      </select>
      <input v-model.number="quantidade" @input="calcularTotal" placeholder="Quantidade" type="number" required>
      <input v-model="total" placeholder="Total" readonly>
      <input v-model="dataPedido" placeholder="Data do Pedido" type="date" required>
      <select v-model="status" required>
        <option>Pendente</option>
        <option v-if="editMode">Em preparo</option>
        <option v-if="editMode">Enviado</option>
        <option v-if="editMode">Entregue</option>
      </select>
      <button type="submit">{{ editMode ? 'Atualizar' : 'Adicionar' }}</button>
      <button v-if="editMode" @click="cancelEdit">Cancelar</button>
    </form>
    <ul>
      <li v-for="pedido in pedidos" :key="pedido.id">
        {{ pedido.clienteNome }} - {{ pedido.produtoNome }} - R$ {{ pedido.total.toFixed(2) }} - {{ pedido.status }}
        <button @click="editPedido(pedido)">Editar</button>
        <button @click="deletePedido(pedido.id)">Excluir</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '../main';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default {
  data() {
    return {
      clienteId: '',
      produtoId: '',
      quantidade: 1,
      total: 0,
      dataPedido: '',
      status: 'Pendente',
      pedidos: [],
      clientes: [],
      produtos: [],
      produtoSelecionado: null,
      editMode: false,
      pedidoId: null
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
    updateProdutoSelecionado() {
      this.produtoSelecionado = this.produtos.find(produto => produto.id === this.produtoId);
      this.calcularTotal();
    },
    calcularTotal() {
      if (this.produtoSelecionado) {
        this.total = (this.produtoSelecionado.preco * this.quantidade).toFixed(2);
      } else {
        this.total = 0;
      }
    },
    async addPedido() {
      const pedidosCollection = collection(db, 'pedidos');
      const cliente = this.clientes.find(cliente => cliente.id === this.clienteId);
      const produto = this.produtos.find(produto => produto.id === this.produtoId);
      if (this.editMode) {
        const pedidoDoc = doc(db, 'pedidos', this.pedidoId);
        await updateDoc(pedidoDoc, {
          clienteId: this.clienteId,
          produtoId: this.produtoId,
          quantidade: this.quantidade,
          total: parseFloat(this.total),
          dataPedido: this.dataPedido,
          status: this.status,
          clienteNome: cliente ? cliente.nome : '',
          produtoNome: produto ? produto.nome : ''
        });
        this.editMode = false;
      } else {
        await addDoc(pedidosCollection, {
          clienteId: this.clienteId,
          produtoId: this.produtoId,
          quantidade: this.quantidade,
          total: parseFloat(this.total),
          dataPedido: this.dataPedido,
          status: this.status,
          clienteNome: cliente ? cliente.nome : '',
          produtoNome: produto ? produto.nome : ''
        });
      }
      this.resetForm();
    },
    async deletePedido(id) {
      const pedidoDoc = doc(db, 'pedidos', id);
      await deleteDoc(pedidoDoc);
    },
    editPedido(pedido) {
      this.clienteId = pedido.clienteId;
      this.produtoId = pedido.produtoId;
      this.quantidade = pedido.quantidade;
      this.total = pedido.total;
      this.dataPedido = pedido.dataPedido;
      this.status = pedido.status;
      this.pedidoId = pedido.id;
      this.editMode = true;
    },
    cancelEdit() {
      this.resetForm();
      this.editMode = false;
    },
    resetForm() {
      this.clienteId = '';
      this.produtoId = '';
      this.quantidade = 1;
      this.total = 0;
      this.dataPedido = '';
      this.status = 'Pendente';
      this.pedidoId = null;
    }
  }
}
</script>
