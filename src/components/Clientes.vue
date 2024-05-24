<template>
    <div>
      <h2>Clientes</h2>
      <form @submit.prevent="addCliente">
        <input v-model="nome" placeholder="Nome">
        <input v-model="rua" placeholder="Rua">
        <input v-model="bairro" placeholder="Bairro">
        <input v-model="numero" placeholder="Número">
        <input v-model="cidade" placeholder="Cidade">
        <input v-model="cep" placeholder="CEP" @blur="buscaCep">
        <input v-model="estado" placeholder="Estado">
        <input v-model="telefone" placeholder="Telefone">
        <input v-model="cpf" placeholder="CPF">
        <select v-model="sexo">
          <option>Masculino</option>
          <option>Feminino</option>
          <option>Outro</option>
        </select>
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        <li v-for="cliente in clientes" :key="cliente.id">{{ cliente.nome }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { db } from '../main';
  import { collection, onSnapshot, addDoc } from 'firebase/firestore';
  
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
        clientes: []
      }
    },
    created() {
      const clientesCollection = collection(db, 'clientes');
      onSnapshot(clientesCollection, (snapshot) => {
        this.clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
    },
    methods: {
      addCliente() {
        const clientesCollection = collection(db, 'clientes');
        addDoc(clientesCollection, {
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
        this.nome = this.rua = this.bairro = this.numero = this.cidade = this.cep = this.estado = this.telefone = this.cpf = this.sexo = '';
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
  