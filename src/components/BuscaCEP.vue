<template>
    <div>
      <input v-model="cep" placeholder="CEP" @blur="buscaCep">
      <input v-model="rua" placeholder="Rua">
      <!-- depois coloco mais -->
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        cep: '',
        rua: '',
        // depois adiciono mais
      }
    },
    methods: {
      buscaCep() {
        axios.get(`https://viacep.com.br/ws/${this.cep}/json/`)
          .then(response => {
            this.rua = response.data.logradouro;
            // depois preencho mais
          })
          .catch(() => alert('CEP não encontrado'));
      }
    }
  }
  </script>
  