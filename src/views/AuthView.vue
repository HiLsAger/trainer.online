<template>
  <div class="form">
    <LoginComponent v-if="isLogin" />
    <RegisterComponent v-else />
    <button v-on:click="changeAuth">
      {{ isLogin ? "Зарегистрироваться" : "Уже зарегистрирован" }}
    </button>
  </div>
</template>

<script lang="ts">
import LoginComponent from "@/components/auth/Login.vue";
import RegisterComponent from "@/components/auth/Register.vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    LoginComponent,
    RegisterComponent,
  },
})
export default class AuthView extends Vue {
  isLogin: boolean = true;

  get LoginComponent() {
    return LoginComponent;
  }

  get RegisterComponent() {
    return RegisterComponent;
  }

  changeAuth() {
    this.isLogin = !this.isLogin;
  }
}
</script>

<style lang="scss">
.container{
  display: flex;

  .content{
    display: flex;
    justify-content: center;
    
  }
}
</style>
