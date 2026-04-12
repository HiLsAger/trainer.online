<template>
  <div :class="label.error ? 'validate-error' : ''">
    <label :for="label.title">{{ label.title }}</label>
    <input
        :id="name"
        :name="name"
        :required="label.required"
        :placeholder="label.placeholder"
        type="text"
        :value="formattedValue"
        @click="togglePicker"
        readonly
        ref="inputRef"
    />
    <div v-if="label.error" class="validate-message"><span>{{ label.error }}</span></div>
    <div v-if="showPicker" class="dropdown-picker" ref="pickerRef">
      <div class="picker-header">
        <button
            class="nav-button"
            @click="previousStep"
            :disabled="currentStepIndex === 0"
        >
          ←
        </button>
        <h3 class="picker-title">{{ currentStepTitle }}</h3>
        <button
            class="nav-button"
            @click="nextStep"
            :disabled="currentStepIndex === availableSteps.length - 1 || !canProceed"
        >
          →
        </button>
      </div>
      <div class="picker-body">
        <div v-if="needsYear" :class="[currentStep !== 'decade' ? 'hide': '', 'decade-selection']">
          <div
              v-for="decade in decades"
              :key="decade"
              class="selection-item"
              :class="{ 'selected': selectedDecade === decade }"
              @click="selectDecade(decade)"
          >
            {{ decade }} - {{ decade + 9 }}
          </div>
        </div>
        <div v-if="needsYear" :class="[currentStep !== 'year' ? 'hide': '', 'year-selection']">
          <div
              v-for="year in years"
              :key="year"
              class="selection-item"
              :class="{ 'selected': selectedYear === year }"
              @click="selectYear(year)"
          >
            {{ year }}
          </div>
        </div>
        <div v-if="needsMonth" :class="[currentStep !== 'month' ? 'hide': '', 'month-selection']">
          <div
              v-for="(month, index) in months"
              :key="index"
              class="selection-item"
              :class="{ 'selected': selectedMonth === index }"
              @click="selectMonth(index)"
          >
            {{ month }}
          </div>
        </div>
        <div v-if="needsDay" :class="[currentStep !== 'day' ? 'hide': '', 'day-selection']">
          <div class="days-header">
            <span v-for="day in weekDays" :key="day" class="week-day">{{ day }}</span>
          </div>
          <div class="days-grid">
            <div
                v-for="day in calendarDays"
                :key="`${selectedYear}-${selectedMonth}-${day.date}-${day.isCurrentMonth}`"
                class="day-item"
                :class="{
                'selected': day.isCurrentMonth && selectedDay === day.date,
                'other-month': !day.isCurrentMonth,
                'current-day': day.isCurrentMonth && isCurrentDay(day.date)
              }"
                @click="day.isCurrentMonth && selectDay(day.date)"
            >
              {{ day.date }}
            </div>
          </div>
        </div>
        <div v-if="needsHours || needsMinutes || needsSeconds"
             :class="[currentStep !== 'time' ? 'hide': '', 'time-selection']">
          <div class="time-controls">
            <div class="time-group" v-if="needsHours">
              <label>Часы:</label>
              <input
                  type="number"
                  v-model.number="selectedHour"
                  class="time-input"
                  :min="0"
                  :max="23"
                  @change="validateTime"
              >
            </div>
            <div class="time-group" v-if="needsMinutes">
              <label>Минуты:</label>
              <input
                  type="number"
                  v-model.number="selectedMinute"
                  class="time-input"
                  :min="0"
                  :max="59"
                  @change="validateTime"
              >
            </div>
            <div class="time-group" v-if="needsSeconds">
              <label>Секунды:</label>
              <input
                  type="number"
                  v-model.number="selectedSecond"
                  class="time-input"
                  :min="0"
                  :max="59"
                  @change="validateTime"
              >
            </div>
          </div>
          <div class="time-actions">
            <button class="btn btn-primary" @click="applySelection">Применить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options} from 'vue-class-component';
import {Label} from '@/utility/interfaces/label.interface';
import BaseField from "@/components/fields/fields/BaseField";

interface DateTimeOptions {
  mask?: string;
  startStep?: string;
}

@Options({
  props: {
    label: Object as () => Label & { options?: DateTimeOptions },
    name: String,
    alias: String,
  },
})
export default class DateTimePicker extends BaseField {
  protected showPicker = false;
  protected currentStep = '';
  protected availableSteps: string[] = [];

  protected selectedDecade = 0;
  protected selectedYear = 0;
  protected selectedMonth = 0;
  protected selectedDay = 0;
  protected selectedHour = 0;
  protected selectedMinute = 0;
  protected selectedSecond = 0;

  protected readonly months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  protected readonly weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  get mask(): string {
    return this.label.options?.mask || 'y-m-d h:i:s';
  }

  get startStep(): string {
    return this.label.options?.startStep || this.availableSteps[0];
  }

  get needsYear(): boolean {
    return this.mask.includes('y');
  }

  get needsMonth(): boolean {
    return this.mask.includes('m');
  }

  get needsDay(): boolean {
    return this.mask.includes('d');
  }

  get needsHours(): boolean {
    return this.mask.includes('h');
  }

  get needsMinutes(): boolean {
    return this.mask.includes('i');
  }

  get needsSeconds(): boolean {
    return this.mask.includes('s');
  }

  get needsTime(): boolean {
    return this.needsHours || this.needsMinutes || this.needsSeconds;
  }

  get currentStepIndex(): number {
    return this.availableSteps.indexOf(this.currentStep);
  }

  get currentStepTitle(): string {
    const titles: { [key: string]: string } = {
      'decade': 'Выбор десятилетия',
      'year': 'Выбор года',
      'month': 'Выбор месяца',
      'day': 'Выбор дня',
      'time': 'Выбор времени'
    };
    return titles[this.currentStep] || '';
  }

  get canProceed(): boolean {
    switch (this.currentStep) {
      case 'decade':
        return this.selectedDecade !== 0;
      case 'year':
        return this.selectedYear !== 0;
      case 'month':
        return this.selectedMonth !== 0;
      case 'day':
        return this.selectedDay !== 0;
      case 'time':
        return this.isTimeValid;
      default:
        return false;
    }
  }

  get isTimeValid(): boolean {
    return (this.needsHours ? this.selectedHour >= 0 && this.selectedHour <= 23 : true) &&
        (this.needsMinutes ? this.selectedMinute >= 0 && this.selectedMinute <= 59 : true) &&
        (this.needsSeconds ? this.selectedSecond >= 0 && this.selectedSecond <= 59 : true);
  }

  get decades(): number[] {
    const currentYear = new Date().getFullYear();
    const startDecade = Math.floor(currentYear / 10) * 10;
    const decades = [];
    for (let i = 0; i < 6; i++) {
      decades.push(startDecade + i * 10);
    }
    return decades;
  }

  get years(): number[] {
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(this.selectedDecade + i);
    }
    return years;
  }

  get calendarDays(): { date: number; isCurrentMonth: boolean }[] {
    if (!this.selectedYear && this.needsYear) return [];
    if (!this.selectedMonth && this.needsMonth) return [];

    const year = this.selectedYear || new Date().getFullYear();
    const month = this.selectedMonth || new Date().getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const daysFromPrevMonth = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      days.push({date: i, isCurrentMonth: false});
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({date: i, isCurrentMonth: true});
    }

    const totalCells = 42; // 6 недель
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({date: i, isCurrentMonth: false});
    }
    console.log(days)
    return days;
  }

  get formattedValue(): string {
    if (!this.hasSelectedDate && !this.hasSelectedTime) return '';

    let result = this.mask;

    if (this.needsYear && this.selectedYear) {
      result = result.replace(/y+/g, this.selectedYear.toString());
    }

    if (this.needsMonth && this.selectedMonth !== undefined) {
      const monthStr = (this.selectedMonth + 1).toString().padStart(2, '0');
      result = result.replace(/m+/g, monthStr);
    }

    if (this.needsDay && this.selectedDay !== 0) {
      const dayStr = this.selectedDay.toString().padStart(2, '0');
      result = result.replace(/d+/g, dayStr);
    }

    if (this.needsHours && this.selectedHour !== undefined) {
      const hourStr = this.selectedHour.toString().padStart(2, '0');
      result = result.replace(/h+/g, hourStr);
    }

    if (this.needsMinutes && this.selectedMinute !== undefined) {
      const minuteStr = this.selectedMinute.toString().padStart(2, '0');
      result = result.replace(/i+/g, minuteStr);
    }

    if (this.needsSeconds && this.selectedSecond !== undefined) {
      const secondStr = this.selectedSecond.toString().padStart(2, '0');
      result = result.replace(/s+/g, secondStr);
    }

    return result;
  }

  get hasSelectedDate(): boolean {
    return (this.needsYear ? this.selectedYear !== 0 : true) &&
        (this.needsMonth ? this.selectedMonth !== undefined : true) &&
        (this.needsDay ? this.selectedDay !== 0 : true);
  }

  get hasSelectedTime(): boolean {
    return (this.needsHours ? this.selectedHour !== undefined : true) &&
        (this.needsMinutes ? this.selectedMinute !== undefined : true) &&
        (this.needsSeconds ? this.selectedSecond !== undefined : true);
  }

  protected initializeSteps(): void {
    this.availableSteps = [];

    if (this.needsYear) {
      this.availableSteps.push('decade', 'year');
    }
    if (this.needsMonth) {
      this.availableSteps.push('month');
    }
    if (this.needsDay) {
      this.availableSteps.push('day');
    }
    if (this.needsTime) {
      this.availableSteps.push('time');
    }

    const startIndex = Math.max(0, this.availableSteps.indexOf(this.startStep));
    this.currentStep = this.availableSteps[startIndex];
  }

  protected initializeFromCurrentValue(): void {
    if (this.label.value) {
      this.parseValueFromMask(this.label.value.toString());
    } else {
      this.setCurrentDate();
    }
  }

  protected setCurrentDate(): void {
    const now = new Date();
    this.selectedYear = now.getFullYear();
    this.selectedMonth = now.getMonth();
    this.selectedDay = now.getDate();
    this.selectedHour = now.getHours();
    this.selectedMinute = now.getMinutes();
    this.selectedSecond = now.getSeconds();
    this.selectedDecade = Math.floor(this.selectedYear / 10) * 10;
  }

  protected parseValueFromMask(value: string): void {
    try {
      const yearMatch = value.match(/(\d{4})/);
      const monthMatch = value.match(/-(\d{2})-/) || value.match(/(\d{2})/);
      const dayMatch = value.match(/-(\d{2})(?:\s|$)/) || value.match(/(\d{2})(?:\s|$)/);
      const timeMatch = value.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/) || value.match(/(\d{1,2}):(\d{1,2})/);

      if (this.needsYear && yearMatch) {
        this.selectedYear = parseInt(yearMatch[1]);
        this.selectedDecade = Math.floor(this.selectedYear / 10) * 10;
      } else if (this.needsYear) {
        this.selectedYear = new Date().getFullYear();
        this.selectedDecade = Math.floor(this.selectedYear / 10) * 10;
      }

      if (this.needsMonth && monthMatch) {
        this.selectedMonth = parseInt(monthMatch[1]) - 1;
      } else if (this.needsMonth) {
        this.selectedMonth = new Date().getMonth();
      }

      if (this.needsDay && dayMatch) {
        this.selectedDay = parseInt(dayMatch[1]);
      } else if (this.needsDay) {
        this.selectedDay = new Date().getDate();
      }

      if (timeMatch) {
        if (this.needsHours) {
          this.selectedHour = parseInt(timeMatch[1]) || 0;
        }
        if (this.needsMinutes) {
          this.selectedMinute = parseInt(timeMatch[2]) || 0;
        }
        if (this.needsSeconds) {
          this.selectedSecond = parseInt(timeMatch[3]) || 0;
        }
      } else {
        const now = new Date();
        if (this.needsHours) this.selectedHour = now.getHours();
        if (this.needsMinutes) this.selectedMinute = now.getMinutes();
        if (this.needsSeconds) this.selectedSecond = now.getSeconds();
      }
    } catch (error) {
      console.error('Error parsing date value:', error);
      this.setCurrentDate();
    }
  }

  public togglePicker(event: MouseEvent): void {
    event.stopPropagation();

    if (this.showPicker) {
      this.closePicker();
    } else {
      this.openPicker();
    }
  }

  public openPicker(): void {
    this.showPicker = true;

    this.initializeSteps();
    this.initializeFromCurrentValue();

    this.$nextTick(() => {
      this.addClickOutsideListener();
    });
  }

  public closePicker(): void {
    this.showPicker = false;
    this.removeClickOutsideListener();
  }

  protected applySelection(): void {
    if (this.isTimeValid) {
      this.updateInputValue();
      this.closePicker();
    }
  }

  protected updateInputValue(): void {
    const fakeEvent = {
      target: {
        value: this.formattedValue
      }
    } as unknown as Event;
    this.handleInput(fakeEvent);
  }

  protected addClickOutsideListener(): void {
    document.addEventListener('click', this.handleClickOutside);
  }

  protected removeClickOutsideListener(): void {
    document.removeEventListener('click', this.handleClickOutside);
  }

  protected handleClickOutside(event: MouseEvent): void {
    const target = event.target as Node;

    const pickerRef = this.$refs.pickerRef as HTMLDivElement;
    const inputRef = this.$refs.inputRef as HTMLInputElement;

    if (pickerRef && !pickerRef.contains(target) &&
        inputRef && !inputRef.contains(target)) {
      this.closePicker();
    }
  }

  protected validateTime(): void {
    if (this.selectedHour < 0) this.selectedHour = 0;
    if (this.selectedHour > 23) this.selectedHour = 23;
    if (this.selectedMinute < 0) this.selectedMinute = 0;
    if (this.selectedMinute > 59) this.selectedMinute = 59;
    if (this.selectedSecond < 0) this.selectedSecond = 0;
    if (this.selectedSecond > 59) this.selectedSecond = 59;
  }

  protected previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStep = this.availableSteps[this.currentStepIndex - 1];
    }
  }

  protected nextStep(): void {
    if (!this.canProceed) {
      return;
    }

    if (this.currentStepIndex < this.availableSteps.length - 1) {
      this.currentStep = this.availableSteps[this.currentStepIndex + 1];
      return;
    }

    if (this.currentStepIndex === this.availableSteps.length - 1) {
      this.applySelection();
      return;
    }
  }

  protected selectDecade(decade: number): void {
    this.selectedDecade = decade;
    this.nextStep();
  }

  protected selectYear(year: number): void {
    this.selectedYear = year;
    this.nextStep();
  }

  protected selectMonth(month: number): void {
    this.selectedMonth = month;
    this.nextStep();
  }

  protected selectDay(day: number): void {
    this.selectedDay = day;
    this.nextStep();
  }

  protected isCurrentDay(day: number): boolean {
    const now = new Date();
    return this.selectedYear === now.getFullYear() &&
        this.selectedMonth === now.getMonth() &&
        day === now.getDate();
  }

  protected triggerInitialInput(): void {
    if (this.formattedValue === undefined) {
      return;
    }

    const fakeEvent = {
      target: {
        value: this.formattedValue
      }
    } as unknown as Event;

    this.handleInput(fakeEvent);
  }

  public mounted(): void {
    this.initializeFromCurrentValue();
    this.triggerInitialInput();
  }

  public beforeUnmount(): void {
    this.removeClickOutsideListener();
  }
}
</script>

<style lang="scss">
.input-wrapper input {
  width: 100%;
  cursor: pointer;
}

.dropdown-picker {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 2px;

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--black);
    background: var(--white);
    flex-direction: row;
  }

  .picker-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    flex: 1;
  }

  .nav-button {
    background: var(--black);
    color: white;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 12px;

    &:disabled {
      background: var(--gray);
      cursor: not-allowed;
    }
  }

  .picker-body {
    max-height: 400px;
    overflow-y: auto;
    margin: 0;

    .hide {
      display: none;
    }
  }

  .selection-item {
    padding: 8px;
    margin: 2px;
    border: 1px solid var(--gray);
    cursor: pointer;
    text-align: center;
    font-size: 12px;

    &.selected {
      background: var(--black);
      color: var(--orig-white);
      border-color: var(--black);
    }

    &:hover {
      background: var(--black);
      color: var(--white);
    }
  }

  .days-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 5px;
  }

  .week-day {
    text-align: center;
    font-size: 10px;
    font-weight: bold;
    color: var(--gray);
  }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .day-item {
    padding: 6px;
    border: 1px solid var(--white);
    text-align: center;
    cursor: pointer;
    font-size: 11px;

    &.selected {
      background: var(--black);
      color: white;
      border-color: var(--black);
    }

    &.other-month {
      background-color: gray;
      color: var(--white);
      cursor: not-allowed;
    }

    &.current-day {
      border-color: var(--black);
      font-weight: bold;
    }

    &:hover {
      background: var(--black);
      color: var(--white);
    }
  }

  .time-controls {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    margin: 0;
  }

  .time-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
  }

  .time-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .btn {
    padding: 6px 12px;
    border: none;
    cursor: pointer;
    font-size: 11px;

    &.btn-primary {
      background: var(--black);
      color: white;
    }
  }

  .decade-selection,
  .year-selection,
  .month-selection {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }
}
</style>
