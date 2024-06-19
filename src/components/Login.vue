<template>
  <v-container>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="6">
        <v-card class="elevation-12">
          <v-card-title class="headline">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                outlined
                prepend-inner-icon="mdi-email"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                required
                outlined
                prepend-inner-icon="mdi-lock"
              ></v-text-field>
              <v-btn type="submit" color="primary" block class="mt-4">
                Login
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="irParaCadastro">
              Cadastrar-se
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const login = () => {
      if (!/\S+@\S+\.\S+/.test(email.value)) {
        alert('Por favor, insira um email válido.');
        return;
      }

      const auth = getAuth();
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          router.push('/clientes');
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/user-not-found':
              alert('Email não encontrado. Por favor, verifique o email e tente novamente.');
              break;
            case 'auth/wrong-password':
              alert('Senha incorreta. Por favor, tente novamente.');
              break;
            case 'auth/invalid-email':
              alert('Email inválido. Por favor, verifique o email e tente novamente.');
              break;
            case 'auth/invalid-credential':
              alert('Credencial inválida. Por favor, verifique suas credenciais e tente novamente.');
              break;
            default:
              alert('Erro ao fazer login: ' + error.message);
          }
        });
    };

    const irParaCadastro = () => {
      router.push('/cadastro');
    };

    return { email, password, login, irParaCadastro };
  }
};
</script>

<style scoped>
.v-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ffffff;
}

.v-card {
  padding: 20px;
  border-radius: 10px;
}

.v-card-title {
  text-align: center;
  font-size: 24px;
  color: #3f51b5;
}

.v-btn {
  font-size: 16px;
}

.v-btn.secondary {
  color: #3f51b5;
}
</style>
