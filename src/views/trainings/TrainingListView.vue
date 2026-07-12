<template>
  <div class="training-list-actions">
    <div class="filters">
      <FieldsComponent
          :key="fieldsCounter"
          ref="fieldsComponentRef"
          :labels="filterForm.labels"
          :alias="filterForm.alias"
          :is-horizontal="true"
          @handleInputFields="handleInputUpdate"
      />
    </div>
  </div>
  <div></div>
  <div></div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import FieldsComponent from "@/components/fields/FieldComponent.vue";
import {Form} from "@/utility/interfaces/label.interface";

@Options({
  components: {FieldsComponent},
  props: {
    training_room_id: {
      type: Number,
      required: false
    },
    date: {
      type: String,
      required: false
    },
  }
})
export default class TrainingListView extends Vue {
  training_room_id!: number;
  date!: string;

  protected formData: Record<string, any> = {};
  protected fieldsCounter: number = 0;

  protected filterForm: Form = {
    alias: "trainings-sheet",
    title: 'Выбор зала',
    action: 'test',
    method: 'GET',
    labels: {
      training_room_id: {
        title: 'Зал',
        placeholder: 'Зал',
        templateType: 'select',
        type: 'number',
        list: 'fields/training-rooms',
        value: '@COOKIE',
        width: "20%"
      },
      date: {
        title: 'Дата',
        placeholder: 'дд.мм.гггг',
        templateType: 'datetime',
        required: true,
        options: {
          mask: 'd.m.y',
          convert: 'y-m-d'
        },
        width: "33%"
      },
    }
  };

  protected loadTrainings(): void {
    if (!this.formData['training_room_id'] || !this.formData['date']) return;
  }

  protected handleInputUpdate(
      data: Record<string, any>
  ): void {
    this.formData = data;
    this.loadTrainings()
  }

  protected convertDateFormat(dateStr: string): string {
    if (!dateStr) return '';

    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}.${month}.${year}`;
    }

    return dateStr;
  }

  mounted() {
    if (this.training_room_id) {
      this.filterForm.labels["training_room_id"].value = this.training_room_id
    }

    if (this.date) {
      this.filterForm.labels["date"].value = this.convertDateFormat(this.date)
    }
  }
}
</script>

<style lang="scss">

</style>