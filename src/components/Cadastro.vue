<template>
  <v-container>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="6">
        <v-card class="elevation-12">
          <v-card-title class="headline">Cadastro</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register">
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
                Cadastrar
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p>Já tem uma conta? <router-link to="/" class="text-decoration-none">Entrar</router-link></p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const register = () => {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          router.push('/login');
        })
        .catch((error) => {
          console.error('Erro ao cadastrar:', error);
        });
    };

    return { email, password, register };
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

.v-card-actions {
  text-align: center;
  margin-top: 16px;
}

.text-decoration-none {
  text-decoration: none;
  color: #3f51b5;
}

.v-btn.secondary {
  color: #3f51b5;
}
</style>
