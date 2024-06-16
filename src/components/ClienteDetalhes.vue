<template>
    <v-container>
      <v-card>
        <v-card-title>
          <h2>Detalhes do Cliente</h2>
        </v-card-title>
        <v-card-text>
          <div class="cliente-detalhes">
            <v-row>
              <v-col cols="12" md="6">
                <p><strong>Nome:</strong> {{ cliente.nome }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p><strong>Rua:</strong> {{ cliente.rua }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p><strong>Bairro:</strong> {{ cliente.bairro }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p><strong>Número:</strong> {{ cliente.numero }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p><strong>Cidade:</strong> {{ cliente.cidade }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p><strong>CEP:</strong> {{ cliente.cep }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p><strong>Estado:</strong> {{ cliente.estado }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p><strong>Telefone:</strong> {{ cliente.telefone }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p><strong>CPF:</strong> {{ cliente.cpf }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <p><strong>Sexo:</strong> {{ cliente.sexo }}</p>
              </v-col>
            </v-row>
            <v-btn color="primary" @click="voltar">Voltar</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { db } from '../main';
  import { doc, getDoc } from 'firebase/firestore';
  
  export default {
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        cliente: {}
      };
    },
    async created() {
      try {
        if (this.id) {
          const docRef = doc(db, 'clientes', this.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            this.cliente = docSnap.data();
          } else {
            console.log('Nenhum documento encontrado!');
          }
        } else {
          console.log('ID do cliente não está definido.');
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do cliente:', error);
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
  .v-container {
    padding: 20px;
  }
  .v-card {
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  .v-card-title {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
  .cliente-detalhes {
    margin-top: 20px;
  }
  .v-row {
    margin-bottom: 20px;
  }
  .v-col p {
    margin: 5px 0;
    font-size: 16px;
    line-height: 1.6;
  }
  .v-btn {
    margin-top: 20px;
  }
  </style>
  