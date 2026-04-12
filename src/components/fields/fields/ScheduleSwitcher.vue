<template>
  <div :class="label.error ? 'validate-error' : ''">
    <label :for="label.title">{{ label.title }}</label>
    <div class="schedule-row">
      <div v-for="(day, key) in daysOfWeek" :key="key">
        <button
            type="button"
            :class="['btn btn-submit', { 'active': isDayActive(parseInt(key)) }]"
            @click="toggleDay(parseInt(key))"
        >
          {{ day }}
        </button>
      </div>
    </div>
    <div v-if="label.error" class="validate-message"><span>{{ label.error }}</span></div>
  </div>
</template>

<script lang="ts">
import {Options} from 'vue-class-component';
import {Label} from '@/utility/interfaces/label.interface';
import BaseField from "@/components/fields/fields/BaseField";

interface DaysOfWeekValues {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

@Options({
  props: {
    label: Object as () => Label,
    name: String,
    alias: String,
  },
})
export default class ScheduleSwitcher extends BaseField {
  protected daysOfWeek: Record<number, string> = {
    1: 'ПН',
    2: 'ВТ',
    3: 'СР',
    4: 'ЧТ',
    5: 'ПТ',
    6: 'СБ',
    7: 'ВС',
  };

  protected readonly DAY_BY_CODE: Record<number, keyof DaysOfWeekValues> = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
    7: 'sunday',
  };

  protected daysOfWeekValues: DaysOfWeekValues = {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  };

  protected isDayActive(dayNumber: number): boolean {
    const dayCode = this.DAY_BY_CODE[dayNumber];
    return this.daysOfWeekValues[dayCode] === 1;
  }

  protected toggleDay(dayNumber: number): void {
    const dayCode = this.DAY_BY_CODE[dayNumber];
    this.daysOfWeekValues[dayCode] = this.daysOfWeekValues[dayCode] === 0 ? 1 : 0;
    this.handleInput();
  }

  public handleInput(): void {
    this.$emit("handleInput", this.value);
  }

  protected get value(): string {
    return Object.values(this.daysOfWeekValues).join('');
  }

  protected parseInitialValue(value: string): void {
    if (!value || value.length !== 7) return;

    const days = Object.keys(this.daysOfWeekValues) as Array<keyof DaysOfWeekValues>;

    for (let i = 0; i < 7; i++) {
      const dayCode = days[i];
      const charValue = value[i];
      this.daysOfWeekValues[dayCode] = charValue === '1' ? 1 : 0;
    }
  }

  protected triggerInitialInput(): void {
    if (this.labelValue === undefined) {
      return;
    }

    this.parseInitialValue(this.labelValue);
    this.handleInput();
  }

  mounted(): void {
    super.mounted();
  }
}
</script>

<style lang="scss">
.form-field .schedule-row {
  flex-direction: row;
  margin: 0;

  & > div {
    margin-top: .25rem;
    margin-right: .5rem;
  }
}
</style>
