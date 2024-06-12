<template>
  <div class="container">
    <h2>Clientes</h2>
    <div class="form-list-container">
      <form @submit.prevent="addCliente" class="form">
        <input v-model="nome" placeholder="Nome" required>
        <input v-model="rua" placeholder="Rua" required>
        <input v-model="bairro" placeholder="Bairro" required>
        <input v-model="numero" placeholder="Número" required>
        <input v-model="cidade" placeholder="Cidade" required>
        <input v-model="cep" placeholder="CEP" @blur="buscaCep" required>
        <input v-model="estado" placeholder="Estado" required>
        <input v-model="telefone" placeholder="Telefone" required>
        <input v-model="cpf" placeholder="CPF" required>
        <select v-model="sexo" required>
          <option>Masculino</option>
          <option>Feminino</option>
          <option>Outro</option>
        </select>
        <button type="submit">{{ editMode ? 'Atualizar' : 'Adicionar' }}</button>
        <button v-if="editMode" class="cancel" @click="cancelEdit">Cancelar</button>
      </form>
      <ul class="client-list">
        <li v-for="cliente in clientes" :key="cliente.id" class="client-item">
          <span>{{ cliente.nome }}</span>
          <div class="actions">
            <button @click="editCliente(cliente)" class="edit">Editar</button>
            <button @click="deleteCliente(cliente.id)" class="delete">Excluir</button>
            <button @click="detalhesCliente(cliente.id)" class="details">Detalhes</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { db } from '../main';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default {
  data() {
    return {
      nome: '',
      rua: '',
      bairro: '',
      numero: '',
      cidade: '',
      cep: '',
      estado: '',
      telefone: '',
      cpf: '',
      sexo: '',
      clientes: [],
      editMode: false,
      clienteId: null
    }
  },
  created() {
    const clientesCollection = collection(db, 'clientes');
    onSnapshot(clientesCollection, (snapshot) => {
      this.clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  },
  methods: {
    async addCliente() {
      const clientesCollection = collection(db, 'clientes');
      if (this.editMode) {
        const clienteDoc = doc(db, 'clientes', this.clienteId);
        await updateDoc(clienteDoc, {
          nome: this.nome,
          rua: this.rua,
          bairro: this.bairro,
          numero: this.numero,
          cidade: this.cidade,
          cep: this.cep,
          estado: this.estado,
          telefone: this.telefone,
          cpf: this.cpf,
          sexo: this.sexo
        });
        this.editMode = false;
      } else {
        await addDoc(clientesCollection, {
          nome: this.nome,
          rua: this.rua,
          bairro: this.bairro,
          numero: this.numero,
          cidade: this.cidade,
          cep: this.cep,
          estado: this.estado,
          telefone: this.telefone,
          cpf: this.cpf,
          sexo: this.sexo
        });
      }
      this.resetForm();
    },
    async deleteCliente(id) {
      const clienteDoc = doc(db, 'clientes', id);
      await deleteDoc(clienteDoc);
    },
    editCliente(cliente) {
      this.nome = cliente.nome;
      this.rua = cliente.rua;
      this.bairro = cliente.bairro;
      this.numero = cliente.numero;
      this.cidade = cliente.cidade;
      this.cep = cliente.cep;
      this.estado = cliente.estado;
      this.telefone = cliente.telefone;
      this.cpf = cliente.cpf;
      this.sexo = cliente.sexo;
      this.clienteId = cliente.id;
      this.editMode = true;
    },
    detalhesCliente(id) {
      this.$router.push(`/clientes/${id}`);
    },
    cancelEdit() {
      this.resetForm();
      this.editMode = false;
    },
    resetForm() {
      this.nome = '';
      this.rua = '';
      this.bairro = '';
      this.numero = '';
      this.cidade = '';
      this.cep = '';
      this.estado = '';
      this.telefone = '';
      this.cpf = '';
      this.sexo = '';
      this.clienteId = null;
    },
    buscaCep() {
      axios.get(`https://viacep.com.br/ws/${this.cep}/json/`)
        .then(response => {
          const data = response.data;
          if (!data.erro) {
            this.rua = data.logradouro;
            this.bairro = data.bairro;
            this.cidade = data.localidade;
            this.estado = data.uf;
          } else {
            alert('CEP não encontrado');
          }
        })
        .catch(() => alert('Erro ao buscar CEP'));
    }
  }
}
</script>

<style scoped>
.container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 1000px;
  margin-top: 200px;
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

.client-list {
  list-style: none;
  padding: 0;
  flex: 1;
  background: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
}

.client-item {
  background: #fff;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 10px;
}

.client-item button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.client-item button.edit {
  background: #ffc107;
}

.client-item button.delete {
  background: #dc3545;
}

.client-item button.details {
  background: #17a2b8;
}

.client-item button:hover {
  opacity: 0.8;
}

@media (min-width: 768px) {
  .form-list-container {
    flex-direction: row;
  }

  form, .client-list {
    flex: 1;
    min-width: 0;
  }
}
</style>
