<template>
  <div>
    <h2>Login</h2>
    <input v-model="username" placeholder="Usuário">
    <input v-model="password" placeholder="Senha" type="password">
    <button @click="login">Entrar</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      if (this.username === 'admin' && this.password === '1234') {
        this.$router.push('/clientes');
      } else {
        alert('Usuário ou senha incorretos');
      }
    }
  }
}
</script>
