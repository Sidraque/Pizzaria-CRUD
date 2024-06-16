<template>
  <v-container>
    <v-card>
      <v-card-title class="card-title">
        Pedidos
        <v-btn icon @click="abrirModalFinalizados">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="addPedido" ref="form">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="clienteId"
                :items="clientes"
                item-title="nome"
                item-value="id"
                label="Cliente"
                :rules="[rules.required]"
                required
                outlined
                prepend-inner-icon="mdi-account"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="produtoId"
                :items="produtos"
                item-title="nome"
                item-value="id"
                label="Produto"
                @change="updateProdutoSelecionado"
                :rules="[rules.required]"
                required
                outlined
                prepend-inner-icon="mdi-package-variant"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="quantidade"
                label="Quantidade"
                type="number"
                @input="calcularTotal"
                :rules="[rules.required, rules.number]"
                required
                outlined
                prepend-inner-icon="mdi-numeric"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="total"
                label="Total"
                readonly
                outlined
                prepend-inner-icon="mdi-currency-usd"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="dataPedido"
                label="Data do Pedido"
                type="date"
                :rules="[rules.required]"
                required
                outlined
                prepend-inner-icon="mdi-calendar"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="status"
                :items="statusOptionsComputed"
                label="Status"
                :rules="[rules.required]"
                required
                outlined
                prepend-inner-icon="mdi-truck"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="pt-4">
            <v-col>
              <v-btn color="primary" type="submit" :disabled="!validForm">
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

        <v-select
          v-model="filtroStatus"
          :items="filtrosOptions"
          label="Filtrar por Status"
          outlined
          prepend-inner-icon="mdi-filter"
          class="mb-4"
        >
          <template v-slot:append-item>
            <v-list-item @click="removerFiltro">
              <v-list-item-title>Remover Filtro</v-list-item-title>
            </v-list-item>
          </template>
        </v-select>

        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          class="pagination"
        ></v-pagination>

        <v-list>
          <v-list-item
            v-for="pedido in paginatedPedidos"
            :key="pedido.id"
            class="pedido-item"
          >
            <v-row class="align-center">
              <v-col>
                <v-list-item-content>
                  <v-list-item-title class="list-item-title">
                    {{ pedido.clienteNome }} <br>
                    {{ pedido.produtoNome }} - {{ pedido.categoria }} <br>
                    Quantidade: {{ pedido.quantidade }} <br>
                    Total: R$ {{ pedido.total.toFixed(2) }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="list-item-subtitle">
                    <v-icon left>
                      {{ statusIcons[pedido.status] }}
                    </v-icon>
                    {{ pedido.status }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small color="blue" @click="editPedido(pedido)" v-bind="attrs" v-on="on">
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small color="red" @click="deletePedido(pedido.id)" v-bind="attrs" v-on="on">
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

    <v-dialog v-model="modalFinalizados" max-width="600px">
      <v-card>
        <v-card-title class="headline">Pedidos Finalizados</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="pedido in pedidosFinalizados"
              :key="pedido.id"
              class="pedido-item"
            >
              <v-row class="align-center">
                <v-col>
                  <v-list-item-content>
                    <v-list-item-title class="list-item-title">
                      {{ pedido.clienteNome }} <br>
                      {{ pedido.produtoNome }} - {{ pedido.categoria }} <br>
                      Quantidade: {{ pedido.quantidade }} <br>
                      Total: R$ {{ pedido.total.toFixed(2) }}
                      <br>
                      Data de Finalização: {{ formatDate(pedido.dataFinalizacao) }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="list-item-subtitle">
                      <v-icon left>
                        {{ statusIcons[pedido.status] }}
                      </v-icon>
                      {{ pedido.status }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="modalFinalizados = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { db } from '../main';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default {
  setup() {
    const clienteId = ref('');
    const produtoId = ref('');
    const quantidade = ref(1);
    const total = ref(0);
    const dataPedido = ref('');
    const dataFinalizacao = ref(null);
    const status = ref('Pendente');
    const pedidos = ref([]);
    const pedidosFinalizados = ref([]);
    const clientes = ref([]);
    const produtos = ref([]);
    const produtoSelecionado = ref(null);
    const editMode = ref(false);
    const pedidoId = ref(null);
    const filtroStatus = ref('');
    const modalFinalizados = ref(false);
    const statusOptions = ref(['Pendente', 'Em preparo', 'Enviado', 'Entregue']);
    const filtrosOptions = ref(['Pendente', 'Em preparo', 'Enviado']);
    const rules = {
      required: value => !!value || 'Campo obrigatório',
      number: value => !isNaN(value) || 'Deve ser um número'
    };
    const currentPage = ref(1);
    const itemsPerPage = 5;

    const statusIcons = {
      'Pendente': 'mdi-clock-outline',
      'Em preparo': 'mdi-silverware-fork-knife',
      'Enviado': 'mdi-truck-fast',
      'Entregue': 'mdi-check-circle-outline'
    };

    const validForm = computed(() => {
      return clienteId.value && produtoId.value && quantidade.value > 0 && dataPedido.value && status.value;
    });

    const statusOptionsComputed = computed(() => {
      return editMode.value ? statusOptions.value : ['Pendente'];
    });

    const updateProdutoSelecionado = () => {
      produtoSelecionado.value = produtos.value.find(produto => produto.id === produtoId.value);
      calcularTotal();
    };

    const calcularTotal = () => {
      if (produtoSelecionado.value) {
        total.value = (produtoSelecionado.value.preco * quantidade.value).toFixed(2);
      } else {
        total.value = 0;
      }
    };

    watch(produtoId, updateProdutoSelecionado);
    watch(quantidade, calcularTotal);

    const addPedido = async () => {
      const pedidosCollection = collection(db, 'pedidos');
      const cliente = clientes.value.find(cliente => cliente.id === clienteId.value);
      const produto = produtos.value.find(produto => produto.id === produtoId.value);
      const novoPedido = {
        clienteId: clienteId.value,
        produtoId: produtoId.value,
        quantidade: quantidade.value,
        total: parseFloat(total.value),
        dataPedido: dataPedido.value,
        dataFinalizacao: status.value === 'Entregue' ? serverTimestamp() : null,
        status: status.value,
        clienteNome: cliente ? cliente.nome : '',
        produtoNome: produto ? produto.nome : '',
        categoria: produto ? produto.categoria : ''
      };
      if (editMode.value && pedidoId.value) {
        const pedidoDoc = doc(db, 'pedidos', pedidoId.value);
        await updateDoc(pedidoDoc, novoPedido);
        editMode.value = false;
      } else {
        await addDoc(pedidosCollection, novoPedido);
      }
      resetForm();
    };

    const deletePedido = async (id) => {
      const pedidoDoc = doc(db, 'pedidos', id);
      await deleteDoc(pedidoDoc);
    };

    const editPedido = (pedido) => {
      clienteId.value = pedido.clienteId;
      produtoId.value = pedido.produtoId;
      quantidade.value = pedido.quantidade;
      total.value = pedido.total;
      dataPedido.value = pedido.dataPedido;
      dataFinalizacao.value = pedido.dataFinalizacao;
      status.value = pedido.status;
      pedidoId.value = pedido.id;
      produtoSelecionado.value = produtos.value.find(produto => produto.id === produtoId.value);
      editMode.value = true;
      calcularTotal();
    };

    const cancelEdit = () => {
      resetForm();
      editMode.value = false;
    };

    const resetForm = () => {
      clienteId.value = '';
      produtoId.value = '';
      quantidade.value = 1;
      total.value = 0;
      dataPedido.value = '';
      dataFinalizacao.value = null;
      status.value = 'Pendente';
      pedidoId.value = null;
      produtoSelecionado.value = null;
    };

    const removerFiltro = () => {
      filtroStatus.value = '';
    };

    const abrirModalFinalizados = () => {
      modalFinalizados.value = true;
    };

    const formatDate = (date) => {
      if (!date || !date.seconds) return '';
      const d = new Date(date.seconds * 1000);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    };

    onMounted(() => {
      const clientesCollection = collection(db, 'clientes');
      onSnapshot(clientesCollection, (snapshot) => {
        clientes.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });

      const produtosCollection = collection(db, 'produtos');
      onSnapshot(produtosCollection, (snapshot) => {
        produtos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });

      const pedidosCollection = collection(db, 'pedidos');
      onSnapshot(pedidosCollection, (snapshot) => {
        const allPedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        pedidos.value = allPedidos
          .filter(pedido => pedido.status !== 'Entregue')
          .sort((a, b) => b.id.localeCompare(a.id));
        
        pedidosFinalizados.value = allPedidos
          .filter(pedido => pedido.status === 'Entregue')
          .sort((a, b) => {
            if (!b.dataFinalizacao || !b.dataFinalizacao.seconds) return -1;
            if (!a.dataFinalizacao || !a.dataFinalizacao.seconds) return 1;
            return new Date(b.dataFinalizacao.seconds * 1000) - new Date(a.dataFinalizacao.seconds * 1000);
          });
      });
    });

    const totalPages = computed(() => Math.ceil(filteredPedidos.value.length / itemsPerPage));
    const paginatedPedidos = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredPedidos.value.slice(start, start + itemsPerPage);
    });

    const filteredPedidos = computed(() => {
      if (!filtroStatus.value) {
        return pedidos.value;
      }
      return pedidos.value.filter(pedido => pedido.status === filtroStatus.value);
    });

    return {
      clienteId,
      produtoId,
      quantidade,
      total,
      dataPedido,
      dataFinalizacao,
      status,
      pedidos,
      pedidosFinalizados,
      clientes,
      produtos,
      produtoSelecionado,
      editMode,
      pedidoId,
      validForm,
      statusOptionsComputed,
      filtrosOptions,
      statusIcons,
      rules,
      updateProdutoSelecionado,
      calcularTotal,
      addPedido,
      deletePedido,
      editPedido,
      cancelEdit,
      resetForm,
      currentPage,
      totalPages,
      paginatedPedidos,
      filtroStatus,
      filteredPedidos,
      modalFinalizados,
      abrirModalFinalizados,
      removerFiltro,
      formatDate
    };
  }
};
</script>

<style scoped>
.v-container {
  padding-top: 20px;
  width: 100%;
}
.v-card {
  padding: 20px;
}
.v-card-title {
  font-size: 25px;
  margin-bottom: 30px;
  font-weight: bold;
  color: #3f51b5;
  text-align: center;
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
  justify-content: space-between;
  align-items: center;
}
.v-list-item-title {
  font-size: 18px;
  font-weight: bold;
}
.v-list-item-subtitle {
  font-size: 16px;
  color: #757575;
  display: flex;
  align-items: center;
}
.v-list-item-action {
  display: flex;
  align-items: center;
}
.v-list-item-action > * {
  margin-right: 10px;
}
.v-icon.small {
  font-size: 18px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
