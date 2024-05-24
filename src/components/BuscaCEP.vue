<template>
    <div>
      <input v-model="cep" placeholder="CEP" @blur="buscaCep">
      <input v-model="rua" placeholder="Rua">
      <input v-model="bairro" placeholder="Bairro">
      <input v-model="cidade" placeholder="Cidade">
      <input v-model="estado" placeholder="Estado">
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        cep: '',
        rua: '',
        bairro: '',
        cidade: '',
        estado: ''
      }
    },
    methods: {
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
  