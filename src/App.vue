<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app v-if="authChecked">
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/pizza-restaurant-logo-design-template-9022f8a4931ef2ff05306b99ed88b18d_screen.jpg?ts=1597302429"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-if="loggedIn" class="title">Admin</v-list-item-title>
            <v-list-item-subtitle v-if="loggedIn">{{ userName }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          @click="navigateTo(item.route)"
          class="menu-item"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
        
        <v-divider v-if="loggedIn"></v-divider>

        <v-list-item v-if="loggedIn" @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Desconectar</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app v-if="authChecked">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title></v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container v-if="authChecked">
        <router-view />
      </v-container>
      <v-container v-else>
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      drawer: false,
      loggedIn: false,
      authChecked: false,
      userName: '',
      itemsLoggedOut: [
        { title: "Login", route: "/", icon: "mdi-login" },
        { title: "Cadastro", route: "/cadastro", icon: "mdi-account-plus" },
      ],
      itemsLoggedIn: [
        { title: "Clientes", route: "/clientes", icon: "mdi-account-group" },
        { title: "Produtos", route: "/produtos", icon: "mdi-package-variant" },
        { title: "Pedidos", route: "/pedidos", icon: "mdi-cart" },
      ],
    };
  },
  computed: {
    menuItems() {
      return this.loggedIn ? this.itemsLoggedIn : this.itemsLoggedOut;
    },
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.loggedIn = false;
        this.userName = '';
        this.navigateTo("/");
      } catch (error) {
        this.showSnackbar('Erro ao desconectar: ' + error.message, 'error');
      }
    },
    async fetchUserData(uid) {
      const db = getFirestore();
      const userDoc = doc(db, 'usuario', uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        this.userName = userSnapshot.data().nome;
      } else {
        this.userName = 'Usuário';
      }
    },
    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    }
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.loggedIn = !!user;
      this.authChecked = true;
      if (this.loggedIn) {
        this.fetchUserData(user.uid);
        this.navigateTo("/clientes");
      } else {
        this.navigateTo("/");
      }
    });
  },
};
</script>

<style>
@import "~vuetify/styles";
@import "~@mdi/font/css/materialdesignicons.css";

.v-navigation-drawer {
  color: #000000;
}

.v-list-item {
  color: #000000;
}

.v-list-item-title {
  font-size: 18px;
}

.v-app-bar {
  background: #ffffff;
  color: #000000;
}

.v-toolbar-title {
  font-size: 24px;
}

.v-btn {
  color: #000000;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.menu-item {
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
