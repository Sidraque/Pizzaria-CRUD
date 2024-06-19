<template>
  <v-container>
    <v-card>
      <v-card-title class="card-title">
        Produtos
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="addProduto">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="nome"
                label="Nome"
                :rules="[rules.required]"
                required
                outlined
                prepend-inner-icon="mdi-food"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="preco"
                label="Preço"
                type="text"
                :rules="[rules.required, rules.decimal]"
                required
                outlined
                prepend-inner-icon="mdi-currency-usd"
                @input="formatPrice"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="categoria"
                :items="['Pizza', 'Bebida', 'Sobremesa']"
                label="Categoria"
                :rules="[rules.required]"
                required
                outlined
                prepend-inner-icon="mdi-tag"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="pt-4">
            <v-col>
              <v-btn color="primary" type="submit" :disabled="!valid || !nome || !preco || !categoria">
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
            v-for="produto in produtos"
            :key="produto.id"
            class="product-item"
          >
            <v-row class="align-center">
              <v-col>
                <v-list-item-content>
                  <v-list-item-title>{{ produto.nome }} - R$ {{ formatDisplayPrice(produto.preco) }}</v-list-item-title>
                  <v-list-item-subtitle>{{ produto.categoria }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small color="blue" @click="editProduto(produto)" v-bind="attrs" v-on="on">
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small color="red" @click="deleteProduto(produto.id)" v-bind="attrs" v-on="on">
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Excluir</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { db } from '../main';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default {
  data() {
    return {
      nome: '',
      preco: '',
      categoria: '',
      produtos: [],
      editMode: false,
      produtoId: null,
      valid: false,
      rules: {
        required: value => !!value || 'Campo obrigatório',
        decimal: value => /^[0-9]+(\.[0-9]{3})*(,[0-9]{2})?$/.test(value) || 'Deve ser um número com até duas casas decimais'
      }
    };
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
          preco: this.parsePrice(this.preco),
          categoria: this.categoria
        });
        this.editMode = false;
      } else {
        await addDoc(produtosCollection, {
          nome: this.nome,
          preco: this.parsePrice(this.preco),
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
      this.preco = this.formatPriceValue(produto.preco);
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
      this.preco = '';
      this.categoria = '';
      this.produtoId = null;
    },
    formatPrice(event) {
      let value = event.target.value.replace(/\D/g, '');
      value = (value / 100).toFixed(2) + '';
      value = value.replace(".", ",");
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      this.preco = value;
    },
    formatPriceValue(value) {
      let formattedValue = value.toString().replace('.', ',');
      formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return formattedValue;
    },
    parsePrice(value) {
      return parseFloat(value.replace(/\./g, '').replace(',', '.'));
    },
    formatDisplayPrice(value) {
      return value.toFixed(2).replace('.', ',');
    }
  }
};
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
