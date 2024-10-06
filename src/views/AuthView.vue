<template>
  <div class="component-content auth-component-content">
    <div class="form">
      <LoginComponent v-if="isLogin"/>
      <RegisterComponent v-else/>
      <button class="btn btn-auth" v-on:click="changeAuth">
        {{ isLogin ? "Зарегистрироваться" : "Уже зарегистрирован" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import LoginComponent from "@/components/auth/Login.vue";
import RegisterComponent from "@/components/auth/Register.vue";
import {Options, Vue} from "vue-class-component";

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
.auth-component-content {
  display: flex;
  justify-content: center;
  align-content: center;

  .form {
    width: 20rem;
    margin: auto;

    .change-state {
      border: none;
      text-decoration: underline;

      &:hover {
        background-color: transparent;
        color: var(--hover-color);
      }
    }
  }
}
</style>
