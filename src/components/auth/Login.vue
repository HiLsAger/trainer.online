<template>
  <div class="login-form">
    <FieldsComponent :labels="loginPropertyes" @input="updateFormData" />
    <button v-on:click="onSubmit()">Войти</button>
  </div>
</template>

<script lang="ts">
import self_intefrace from "@/utility/interfaces/SelfInterface";
import axios, { AxiosResponse } from "axios";
import { Options, Vue } from "vue-class-component";
import {loginPropertyes, loginInputs} from "./login.labels"
import { useStore } from "vuex";
import FieldsComponent from "../Fields.vue";
import router from '../../router/index';

@Options({
  components: {
    FieldsComponent
  }
})
export default class LoginComponent extends Vue {
  store = useStore();
  loginPropertyes = loginPropertyes;

  login: loginInputs = {
    login: "",
    hash: "",
  };
  updateFormData(data: Record<string, string>) {
    this.login = { ...this.login, ...data };
  }

  onSubmit() {
    axios
      .post("http://localhost:3000/auth/login", this.login)
      .then((response: AxiosResponse<self_intefrace>) => {
        console.log(response);
        this.store.dispatch("setSelf", response.data);
        router.push('/')
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>

<style lang="scss"></style>
