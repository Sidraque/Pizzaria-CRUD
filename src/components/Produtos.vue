<template>
  <div>
    <h2>Produtos</h2>
    <form @submit.prevent="addProduto">
      <input v-model="nome" placeholder="Nome" required>
      <input v-model.number="preco" placeholder="Preço" step="0.01" required>
      <select v-model="categoria" required>
        <option>Pizza</option>
        <option>Bebida</option>
        <option>Sobremesa</option>
      </select>
      <button type="submit">Adicionar</button>
    </form>
    <ul>
      <li v-for="produto in produtos" :key="produto.id">{{ produto.nome }} - R$ {{ produto.preco.toFixed(2) }}</li>
    </ul>
  </div>
</template>

<script>
import { db } from '../main';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

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
    const produtosCollection = collection(db, 'produtos');
    onSnapshot(produtosCollection, (snapshot) => {
      this.produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  },
  methods: {
    async addProduto() {
      const produtosCollection = collection(db, 'produtos');
      try {
        await addDoc(produtosCollection, {
          nome: this.nome,
          preco: parseFloat(this.preco),
          categoria: this.categoria
        });
        this.nome = '';
        this.preco = 0;
        this.categoria = '';
      } catch (error) {
        console.error('Erro ao adicionar produto:', error);
      }
    }
  }
}
</script>
