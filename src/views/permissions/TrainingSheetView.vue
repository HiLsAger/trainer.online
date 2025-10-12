<template>
  <div class="training-sheet">
    <div class="training-sheet-actions">
      <div class="select-room">
        <FieldsComponent
            :key="fieldsCounter"
            ref="fieldsComponentRef"
            :labels="form.labels"
            @handleInputFields="handleInputUpdate"
        />
      </div>
    </div>
    <div class="training-sheet-table">
      <div class="empty-cell">111</div>
      <div class="header-row">111</div>
      <div class="time-column">111</div>
      <div class="training-body-sheet">111</div>
      <div class="empty-cell">111</div>
      <div class="week-line">111</div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import FieldsComponent from "@/components/fields/FieldComponent.vue";
import {Form} from "@/utility/interfaces/label.interface";

@Options({
  components: {FieldsComponent}
})
export default class TrainingSheetView extends Vue {
  form: Form = {
    title: 'test',
    action: 'test',
    method: 'Get',
    labels: {
      test: {
        title: 'Зал',
        placeholder: 'Зал',
        templateType: 'select',
        list: 'fields/training-rooms',
      }
    },
  };

  fieldsCounter: number = 0;

  handleInputUpdate() {

  }

}
</script>

<style lang="scss">
.training-sheet-actions {
  display: flex;

  .select-room {
  }
}

.training-sheet-table {
  display: grid;
  grid-template-columns: 1fr 20fr;

  & > div {
    border: 1px solid var(--black);
    background-color: #28a745;
  }
}
</style>