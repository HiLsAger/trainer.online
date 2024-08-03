<template>
    <div class="login-form">
      <FieldsComponent :labels="loginPropertyes" @input="updateFormData" />
      <button v-on:click="onSubmit()">Создать аккаунт</button>
    </div>
  </template>
  
  <script lang="ts">
  import self_intefrace from "@/utility/interfaces/SelfInterface";
  import axios, { AxiosResponse } from "axios";
  import { Options, Vue } from "vue-class-component";
  import {registerPropertyes, registerInputs} from "./register.labels"
  import { useStore } from "vuex";
  import FieldsComponent from "../Fields.vue";
  import router from '../../router/index';
  
  @Options({
    components: {
      FieldsComponent
    }
  })
  export default class RegisterComponent extends Vue {
    store = useStore();
    loginPropertyes = registerPropertyes;
    
    register: registerInputs = {
      login: "",
      hash: "",
      name: ""
    };
  
    updateFormData(data: Record<string, string>) {
      this.register = { ...this.register, ...data };
    }
  
    onSubmit() {
      axios
        .post("http://localhost:3000/auth/register", this.register)
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
  