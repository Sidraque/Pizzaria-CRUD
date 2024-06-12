<template>
    <div class="container">
      <h2>Detalhes do Cliente</h2>
      <div class="cliente-detalhes">
        <p><strong>Nome:</strong> {{ cliente.nome }}</p>
        <p><strong>Rua:</strong> {{ cliente.rua }}</p>
        <p><strong>Bairro:</strong> {{ cliente.bairro }}</p>
        <p><strong>Número:</strong> {{ cliente.numero }}</p>
        <p><strong>Cidade:</strong> {{ cliente.cidade }}</p>
        <p><strong>CEP:</strong> {{ cliente.cep }}</p>
        <p><strong>Estado:</strong> {{ cliente.estado }}</p>
        <p><strong>Telefone:</strong> {{ cliente.telefone }}</p>
        <p><strong>CPF:</strong> {{ cliente.cpf }}</p>
        <p><strong>Sexo:</strong> {{ cliente.sexo }}</p>
        <button @click="voltar">Voltar</button>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '../main';
  import { doc, getDoc } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        cliente: {}
      };
    },
    async created() {
      const clienteId = this.$route.params.id;
      const docRef = doc(db, 'clientes', clienteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.cliente = docSnap.data();
      } else {
        console.log('Nenhum documento encontrado!');
      }
    },
    methods: {
      voltar() {
        this.$router.push('/clientes');
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
  }
  
  .cliente-detalhes {
    margin-top: 20px;
  }
  
  p {
    margin: 10px 0;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  