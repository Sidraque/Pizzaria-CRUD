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
      <button type="submit">{{ editMode ? 'Atualizar' : 'Adicionar' }}</button>
      <button v-if="editMode" @click="cancelEdit">Cancelar</button>
    </form>
    <ul>
      <li v-for="produto in produtos" :key="produto.id">
        {{ produto.nome }} - R$ {{ produto.preco.toFixed(2) }}
        <button @click="editProduto(produto)">Editar</button>
        <button @click="deleteProduto(produto.id)">Excluir</button>
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
      nome: '',
      preco: 0,
      categoria: '',
      produtos: [],
      editMode: false,
      produtoId: null
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
      if (this.editMode) {
        const produtoDoc = doc(db, 'produtos', this.produtoId);
        await updateDoc(produtoDoc, {
          nome: this.nome,
          preco: parseFloat(this.preco),
          categoria: this.categoria
        });
        this.editMode = false;
      } else {
        await addDoc(produtosCollection, {
          nome: this.nome,
          preco: parseFloat(this.preco),
          categoria: this.categoria
        });
      }
      this.resetForm();
    },
    async deleteProduto(id) {
      const produtoDoc = doc(db, 'produtos', id);
      await deleteDoc(produtoDoc);
    },
    editProduto(produto) {
      this.nome = produto.nome;
      this.preco = produto.preco;
      this.categoria = produto.categoria;
      this.produtoId = produto.id;
      this.editMode = true;
    },
    cancelEdit() {
      this.resetForm();
      this.editMode = false;
    },
    resetForm() {
      this.nome = '';
      this.preco = 0;
      this.categoria = '';
      this.produtoId = null;
    }
  }
}
</script>
