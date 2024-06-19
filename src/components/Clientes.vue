<template>
  <v-container>
    <v-card>
      <v-card-title class="card-title">
        Clientes
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="addCliente">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="nome"
                label="Nome"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="rua"
                label="Rua"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="bairro"
                label="Bairro"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="numero"
                label="Número"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="cep"
                label="CEP"
                :rules="[rules.required, rules.cep]"
                @input="handleCepInput"
                @blur="buscaCep"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="cidade"
                label="Cidade"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="estado"
                label="Estado"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="telefone"
                label="Telefone"
                :rules="[rules.required, rules.telefone]"
                @input="handleTelefoneInput"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="cpf"
                label="CPF"
                :rules="[rules.required, rules.cpf]"
                @input="handleCpfInput"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="sexo"
                :items="['Masculino', 'Feminino', 'Outro']"
                label="Sexo"
                :rules="[rules.required]"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="pt-4">
            <v-col>
              <v-btn color="primary" type="submit" :disabled="!valid">
                <v-icon left>mdi-check-circle</v-icon>
                {{ editMode ? 'Atualizar' : 'Adicionar' }}
              </v-btn>
            </v-col>
            <v-col v-if="editMode">
              <v-btn color="error" @click="cancelEdit">
                <v-icon left>mdi-close-circle</v-icon>
                Cancelar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-divider class="my-4"></v-divider>

        <v-list>
          <v-list-item
            v-for="cliente in clientes"
            :key="cliente.id"
            class="cliente-item"
            two-line
          >
            <v-row class="align-center">
              <v-col class="d-flex" cols="auto">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small color="blue" @click="editCliente(cliente)" v-bind="attrs" v-on="on">
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small color="red" @click="deleteCliente(cliente.id)" v-bind="attrs" v-on="on">
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Excluir</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small color="green" @click="detalhesCliente(cliente.id)" v-bind="attrs" v-on="on">
                      <v-icon small>mdi-information</v-icon>
                    </v-btn>
                  </template>
                  <span>Detalhes</span>
                </v-tooltip>
              </v-col>
              <v-col>
                <v-list-item-content>
                  <v-list-item-title>{{ cliente.nome }}</v-list-item-title>
                  <v-list-item-subtitle>{{ cliente.telefone }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import { db } from '../main';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { defineRule, configure } from 'vee-validate';
import { required, numeric } from '@vee-validate/rules';
import { maskCpf, maskCep, maskTelefone } from '../js/maskUtils';

defineRule('required', required);
defineRule('numeric', numeric);

configure({
  generateMessage: ctx => {
    const messages = {
      required: `O campo ${ctx.field} é obrigatório.`,
      numeric: `O campo ${ctx.field} deve conter apenas números.`,
    };

    return messages[ctx.rule.name] || `O campo ${ctx.field} é inválido.`;
  },
});

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
      clienteId: null,
      valid: false,
      rules: {
        required: value => !!value || 'Campo obrigatório',
        cpf: value => /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(value) || 'CPF inválido',
        telefone: value => /\(\d{2}\) \d{4,5}-\d{4}/.test(value) || 'Telefone inválido',
        cep: value => /\d{5}-\d{3}/.test(value) || 'CEP inválido'
      }
    }
  },
  created() {
    const clientesCollection = collection(db, 'clientes');
    onSnapshot(clientesCollection, (snapshot) => {
      this.clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  },
  methods: {
    handleCpfInput() {
      this.cpf = maskCpf(this.cpf);
    },
    handleCepInput() {
      this.cep = maskCep(this.cep);
    },
    handleTelefoneInput() {
      this.telefone = maskTelefone(this.telefone);
    },
    async addCliente() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      }

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
      this.$router.push({ name: 'ClienteDetalhes', params: { id } });
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
      this.$refs.form.reset();
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

.v-card-title {
  font-size: 25px;
  margin-bottom: 30px;
  font-weight: bold;
  color: #3f51b5;
  text-align: center;
}

.v-container {
  padding-top: 20px;
  width: 100%;
}
.v-card {
  padding: 20px;
}
.v-divider {
  margin: 20px 0;
}
.v-btn {
  margin-right: 10px;
  font-size: 14px;
}
.v-list-item {
  background-color: #f5f5f5;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.v-list-item-content {
  display: flex;
  justify-content: flex-end;
}
.v-list-item-action {
  display: flex;
  align-items: center;
  margin-right: auto;
}
.v-list-item-action > * {
  margin-right: 10px;
}
.v-icon.small {
  font-size: 18px;
}
</style>
