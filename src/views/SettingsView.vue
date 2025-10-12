<template>
  <div class="settings-groups tabs">
    <button
        v-for="(group, index) in groups"
        @click="!group.active && selectGroup(index)"
        :class="[group.active ? 'active' : '', 'tab btn']">{{ group.name }}
    </button>
  </div>
  <div>
    <FieldComponent
        :key="fieldsCounter"
        ref="fieldsComponentRef"
        :labels="form.labels"
        @handleInputFields="handleInputUpdate"
    />
    <button v-if="form.action" class="btn btn-submit" @click="onSubmit()">
      Подать запрос
    </button>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import FieldComponent from "@/components/fields/FieldComponent.vue";
import {Form} from "@/utility/interfaces/label.interface";
import AxiosHelper from "@/core/helpers/Axios.helper";
import {useStore} from "vuex";
import {IFieldsComponent} from "@/components/fields/IFieldsComponent.intefrace";

@Options({
  components: {
    FieldComponent,
  },
})
export default class SettingsView extends Vue {
  axiosHelper?: AxiosHelper;
  store = useStore()

  groups: Record<string, Tab> = {};
  requestData: object = {};

  form: Form = {
    labels: {}
  };

  fieldsCounter: number = 0;

  async selectGroup(group: string): Promise<void> {
    Object.keys(this.groups).forEach(key => {
      this.groups[key].active = key === group;
    });

    if (this.axiosHelper) {
      this.form = await this.axiosHelper.sendGetRequest(
          `settings/settings-by-group?group=${group}`
      ) as Form
    }

    this.fieldsCounter++;
  }

  handleInputUpdate(data: any) {
    this.requestData = data;
  }

  async onSubmit(): Promise<void> {
    console.log('test')
    if (!this.form.action || !this.requestData || !this.axiosHelper) {
      this.store.dispatch("addToast", {
        type: "error",
        title: "Ошибка",
        message: 'Произошла неизвестная ошибка',
      });
      return;
    }

    const fieldsComponent = this.$refs.fieldsComponentRef as IFieldsComponent;
    if (!fieldsComponent.validate()) {
      this.store.dispatch("addToast", {
        type: "error",
        title: "Ошибка",
        message: 'Ошибки в введённых данных',
      });
      return;
    }

    if (this.axiosHelper) {
      await this.axiosHelper.sendForm(this.form.action, this.requestData);
    }
  }

  async mounted() {
    this.axiosHelper = await AxiosHelper.getInstance();

    if (this.axiosHelper) {
      const response: Record<string, string>
          = await this.axiosHelper.sendGetRequest('settings/groups-settings');

      const entries = Object.entries(response);
      this.groups = entries.reduce((acc, [key, value], index) => {
        acc[key] = {
          name: value,
          active: index === 0
        };

        if (index === 0) {
          this.selectGroup(key);
        }

        return acc;
      }, {} as Record<string, Tab>);
    }
  }
}
</script>

<style lang="scss">
.tabs {
  display: flex;

  .tab {
    margin-right: 1rem;

    &.active {
      background-color: var(--black);
      color: var(--white);
      cursor: pointer;
    }
  }
}
</style>
