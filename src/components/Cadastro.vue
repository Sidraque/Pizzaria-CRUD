<template>
  <v-container>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="6">
        <v-card class="elevation-12">
          <v-card-title class="headline">Cadastro</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="nome"
                label="Nome"
                required
                outlined
                prepend-inner-icon="mdi-account"
              ></v-text-field>
              <v-text-field
                v-model="cpf"
                label="CPF"
                required
                outlined
                prepend-inner-icon="mdi-card-account-details"
              ></v-text-field>
              <v-text-field
                v-model="dataNascimento"
                label="Data de Nascimento"
                type="date"
                required
                outlined
                prepend-inner-icon="mdi-calendar"
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                outlined
                prepend-inner-icon="mdi-email"
                :rules="[emailRule]"
                @blur="checkEmailExists"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                required
                outlined
                prepend-inner-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="toggleShowPassword"
                :rules="[passwordRule]"
                @input="checkPasswordStrength"
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Confirmar Senha"
                required
                outlined
                prepend-inner-icon="mdi-lock"
                :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="toggleShowConfirmPassword"
                :rules="[confirmPasswordRule]"
              ></v-text-field>
              <v-progress-linear
                :value="passwordStrengthValue"
                color="primary"
                height="7"
                class="mb-2"
              ></v-progress-linear>
              <div :class="passwordStrengthClass">{{ passwordStrengthText }}</div>
              <v-btn type="submit" color="primary" block class="mt-4" :disabled="!canRegister">
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
    <v-snackbar v-model="snackbar" :color="snackbarColor" top right>
      {{ snackbarMessage }}
      <v-btn color="white" text @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default {
  setup() {
    const nome = ref('');
    const cpf = ref('');
    const dataNascimento = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const passwordStrengthValue = ref(0);
    const passwordStrengthText = ref('');
    const passwordStrengthClass = ref('');
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const canRegister = ref(true);
    const snackbar = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('');
    const router = useRouter();

    const emailRule = (v) => !!v || 'E-mail é obrigatório';
    const passwordRule = (v) => !!v && v.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/g.test(v) || 'Senha deve ter no mínimo 8 caracteres e um caractere especial';
    const confirmPasswordRule = (v) => v === password.value || 'Senhas não conferem';

    const register = async () => {
      const auth = getAuth();
      const db = getFirestore();

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        await setDoc(doc(db, 'usuario', user.uid), {
          nome: nome.value,
          cpf: cpf.value,
          dataNascimento: dataNascimento.value,
          email: email.value
        });

        snackbarMessage.value = 'Cadastro realizado com sucesso!';
        snackbarColor.value = 'success';
        snackbar.value = true;
        router.push('/');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          snackbarMessage.value = 'E-mail já cadastrado';
        } else {
          snackbarMessage.value = 'Erro ao cadastrar: ' + error.message;
        }
        snackbarColor.value = 'error';
        snackbar.value = true;
      }
    };

    const checkEmailExists = async () => {
      const auth = getAuth();
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email.value);
        if (methods.length > 0) {
          canRegister.value = false;
          snackbarMessage.value = 'E-mail já cadastrado';
          snackbarColor.value = 'error';
          snackbar.value = true;
        } else {
          canRegister.value = true;
        }
      } catch (error) {
        snackbarMessage.value = 'Erro ao verificar e-mail: ' + error.message;
        snackbarColor.value = 'error';
        snackbar.value = true;
      }
    };

    const checkPasswordStrength = () => {
      const value = password.value;
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[a-z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) strength += 1;

      passwordStrengthValue.value = (strength / 5) * 100;

      if (strength <= 2) {
        passwordStrengthText.value = 'Fraca';
        passwordStrengthClass.value = 'text-red';
      } else if (strength === 3 || strength === 4) {
        passwordStrengthText.value = 'Média';
        passwordStrengthClass.value = 'text-orange';
      } else if (strength === 5) {
        passwordStrengthText.value = 'Forte';
        passwordStrengthClass.value = 'text-green';
      }
    };

    const toggleShowPassword = () => {
      showPassword.value = !showPassword.value;
    };

    const toggleShowConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };

    return { 
      nome, 
      cpf, 
      dataNascimento, 
      email, 
      password, 
      confirmPassword, 
      passwordStrengthValue, 
      passwordStrengthText, 
      passwordStrengthClass, 
      register, 
      checkEmailExists, 
      checkPasswordStrength, 
      toggleShowPassword, 
      toggleShowConfirmPassword, 
      emailRule, 
      passwordRule, 
      confirmPasswordRule, 
      canRegister, 
      showPassword, 
      showConfirmPassword,
      snackbar,
      snackbarMessage,
      snackbarColor
    };
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

.text-red {
  color: red;
}

.text-orange {
  color: orange;
}

.text-green {
  color: green;
}
</style>
