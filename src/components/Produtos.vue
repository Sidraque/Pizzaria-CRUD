<template>
  <div class="container">
    <h2>Produtos</h2>
    <div class="form-list-container">
      <form @submit.prevent="addProduto" class="form">
        <input v-model="nome" placeholder="Nome" required>
        <input v-model.number="preco" placeholder="Preço" step="0.01" required>
        <select v-model="categoria" required>
          <option>Pizza</option>
          <option>Bebida</option>
          <option>Sobremesa</option>
        </select>
        <button type="submit">{{ editMode ? 'Atualizar' : 'Adicionar' }}</button>
        <button v-if="editMode" class="cancel" @click="cancelEdit">Cancelar</button>
      </form>
      <ul class="product-list">
        <li v-for="produto in produtos" :key="produto.id" class="product-item">
          <span>{{ produto.nome }} - R$ {{ produto.preco.toFixed(2) }}</span>
          <div class="actions">
            <button @click="editProduto(produto)" class="edit">Editar</button>
            <button @click="deleteProduto(produto.id)" class="delete">Excluir</button>
          </div>
        </li>
      </ul>
    </div>
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

<style scoped>
.container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1400px;
  margin: 80px auto 20px; /* Ajuste conforme necessário para ficar abaixo do menu */
}

.form-list-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

form {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

input, select {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #218838;
}

button.cancel {
  background-color: #dc3545;
}

button.cancel:hover {
  background-color: #c82333;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-size: 24px;
}

.product-list {
  list-style: none;
  padding: 0;
  flex: 1;
  background: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.product-item {
  background: #fff;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  gap: 10px;
}

.product-item button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.product-item button.edit {
  background: #ffc107;
}

.product-item button.delete {
  background: #dc3545;
}

.product-item button:hover {
  opacity: 0.8;
}

@media (min-width: 768px) {
  .form-list-container {
    flex-direction: row;
  }

  form, .product-list {
    flex: 1;
    min-width: 0;
  }
}
</style>
