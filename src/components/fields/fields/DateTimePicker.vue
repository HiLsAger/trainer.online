<template>
  <div :class="label.error ? 'validate-error' : ''">
    <label v-if="label?.title" :for="label.title">{{ label.title }}</label>
    <input
        :id="name"
        :name="name"
        :required="label.required"
        :placeholder="label.placeholder"
        type="text"
        :value="formattedValue()"
        readonly
        ref="inputRef"
        @click="togglePicker"
    />
    <div v-if="label.error" class="validate-message">
      <span>{{ label.error }}</span>
    </div>
    <div v-if="showPicker" class="dropdown-picker" ref="pickerRef">
      <div class="picker-header">
        <button
            class="nav-button"
            @click="previousStep"
            :disabled="currentStepIndex === 0"
        >←
        </button>
        <h3 class="picker-title">{{ currentStepTitle }}</h3>
        <button
            class="nav-button"
            @click="nextStep"
            :disabled="currentStepIndex === availableSteps.length - 1 && !canProceed"
        >→
        </button>
      </div>
      <div class="picker-body">
        <!-- decade -->
        <div v-if="currentStep === 'decade'" class="decade-selection">
          <div
              v-for="decade in decades"
              :key="decade"
              class="selection-item"
              :class="{ selected: selectedDecade === decade }"
              @click="selectDecade(decade)"
          >
            {{ decade }} - {{ decade + 9 }}
          </div>
        </div>
        <!-- year -->
        <div v-if="currentStep === 'year'" class="year-selection">
          <div
              v-for="year in years"
              :key="year"
              class="selection-item"
              :class="{ selected: selectedYear === year }"
              @click="selectYear(year)"
          >{{ year }}
          </div>
        </div>
        <!-- month -->
        <div v-if="currentStep === 'month'" class="month-selection">
          <div
              v-for="(month, index) in months"
              :key="index"
              class="selection-item"
              :class="{ selected: selectedMonth === index }"
              @click="selectMonth(index)"
          >{{ month }}
          </div>
        </div>
        <!-- day -->
        <div v-if="currentStep === 'day'" class="day-selection">
          <div class="days-header">
            <span v-for="day in weekDays" :key="day" class="week-day">
              {{ day }}
            </span>
          </div>
          <div class="days-grid">
            <div
                v-for="day in calendarDays"
                :key="`${day.date}-${day.isCurrentMonth}`"
                class="day-item"
                :class="{
                selected: day.isCurrentMonth && selectedDay === day.date,
                'other-month': !day.isCurrentMonth,
                'current-day': day.isCurrentMonth && isCurrentDay(day.date)
              }"
                @click="day.isCurrentMonth && selectDay(day.date)"
            >{{ day.date }}
            </div>
          </div>
        </div>
        <!-- time -->
        <div v-if="currentStep === 'time'" class="time-selection">
          <div class="time-controls">
            <div class="time-group" v-if="needsHours">
              <label>Часы:</label>
              <input
                  type="number"
                  v-model.number="selectedHour"
                  class="time-input"
                  min="0"
                  max="23"
                  @change="validateTime"
              />
            </div>
            <div class="time-group" v-if="needsMinutes">
              <label>Минуты:</label>
              <input
                  type="number"
                  v-model.number="selectedMinute"
                  class="time-input"
                  min="0"
                  max="59"
                  @change="validateTime"
              />
            </div>
            <div class="time-group" v-if="needsSeconds">
              <label>Секунды:</label>
              <input
                  type="number"
                  v-model.number="selectedSecond"
                  class="time-input"
                  min="0"
                  max="59"
                  @change="validateTime"
              />
            </div>
          </div>
          <div class="time-actions">
            <button class="btn btn-primary" @click="applySelection">
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options} from "vue-class-component";
import {Label} from "@/utility/interfaces/label.interface";
import BaseField from "@/components/fields/fields/BaseField";

interface DateTimeOptions {
  mask?: string;
  startStep?: string;
}

@Options({
  props: {
    label: Object as () => Label & { options?: DateTimeOptions },
    name: String,
    alias: String
  },
  watch: {
    "label.value": {
      immediate: true,
      handler(value: string | number | undefined) {
        value
            ? this.parseValue(value.toString())
            : this.setCurrentDate();
      }
    },
    "label.options": {
      deep: true,
      handler() {
        if (this.label.value) {
          this.parseValue(this.label.value.toString());
        }
      }
    }
  }
})
export default class DateTimePicker extends BaseField {
  protected showPicker = false;
  protected currentStep = "";
  protected availableSteps: string[] = [];

  protected selectedDecade = 0;
  protected selectedYear = 0;
  protected selectedMonth = 0;
  protected selectedDay = 0;
  protected selectedHour = 0;
  protected selectedMinute = 0;
  protected selectedSecond = 0;

  protected readonly months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  protected readonly weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  /**
   * Получение маски из конфигурации, иначе маска по умолчанию d.m.y h:i:s
   */
  get mask(): string {
    return this.label.options?.mask || "d.m.y h:i:s";
  }

  /**
   * Определение стартового этапа, иначе получаем самый первый
   */
  get startStep(): string {
    return this.label.options?.startStep || this.availableSteps[0];
  }

  /**
   * Определение необходимости установки года
   */
  get needsYear(): boolean {
    return this.mask.includes("y");
  }

  /**
   * Определение необходимости установки месяца
   */
  get needsMonth(): boolean {
    return this.mask.includes("m");
  }

  /**
   * Определение необходимости установки дня
   */
  get needsDay(): boolean {
    return this.mask.includes("d");
  }

  /**
   * Определение необходимости установки часа
   */
  get needsHours(): boolean {
    return this.mask.includes("h");
  }

  /**
   * Определение необходимости установки минут
   */
  get needsMinutes(): boolean {
    return this.mask.includes("i");
  }

  /**
   * Определение необходимости установки секунд
   */
  get needsSeconds(): boolean {
    return this.mask.includes("s");
  }

  /**
   * Определение необходимости установки времени
   */
  get needsTime(): boolean {
    return this.needsHours || this.needsMinutes || this.needsSeconds;
  }

  /**
   * Получение текущего этапа из списка доступных
   */
  get currentStepIndex(): number {
    return this.availableSteps.indexOf(this.currentStep);
  }

  /**
   * Названия этапов
   */
  get currentStepTitle(): string {
    return {
      decade: "Выбор десятилетия",
      year: "Выбор года",
      month: "Выбор месяца",
      day: "Выбор дня",
      time: "Выбор времени"
    }[this.currentStep] || "";
  }

  /**
   * Возможно ли перейти в следующему этапу
   */
  get canProceed(): boolean {
    return this.currentStep !== "time" || this.isTimeValid;
  }

  /**
   * Проверка корректности времени
   */
  get isTimeValid(): boolean {
    return (
        this.inRange(this.selectedHour, 0, 23) &&
        this.inRange(this.selectedMinute, 0, 59) &&
        this.inRange(this.selectedSecond, 0, 59)
    );
  }

  /**
   * Является ли день текущим
   */
  protected isCurrentDay(day: number): boolean {
    const now = new Date();

    return (
        now.getFullYear() === this.selectedYear &&
        now.getMonth() === this.selectedMonth &&
        now.getDate() === day
    );
  }

  /**
   * Получение списка десятилетия
   */
  get decades(): number[] {
    const start = Math.floor(new Date().getFullYear() / 10) * 10;
    return Array.from({length: 6}, (_, i) => start + i * 10);
  }

  /**
   * Получение списка годов, для этапа выбора года
   */
  get years(): number[] {
    return Array.from({length: 10}, (_, i) => this.selectedDecade + i);
  }

  /**
   * Расчёт и получение списка календарных дней в 6 строк по 7 дней
   * 1. Получение первого дня в выбранном месяце и расчёт первого дня для календаря, чтобы попасть в 6 строк
   * 2. Расчёт количества дней в выбранном месяце и расчёт дней в предыдущем месяце
   * 3. Заполнение массива дней 42 элементами так, чтобы текущий месяц поместился полностью.
   * Если выбранный месяц + часть предыдущего < 42, то до заполняем массив датами из следующего месяца
   */
  get calendarDays(): { date: number, isCurrentMonth: boolean }[] {
    const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
    const startDay = (firstDay.getDay() + 6) % 7;

    const daysInMonth = new Date(
        this.selectedYear,
        this.selectedMonth + 1,
        0
    ).getDate();

    const prevMonthDays = new Date(
        this.selectedYear,
        this.selectedMonth,
        0
    ).getDate();

    const days = [];
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({date: prevMonthDays - i, isCurrentMonth: false});
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({date: i, isCurrentMonth: true});
    }

    while (days.length < 42) {
      days.push({
        date: days.length - daysInMonth - startDay + 1,
        isCurrentMonth: false
      });
    }

    return days;
  }

  /**
   * Формирование финальной даты, заполняя маску
   */
  formattedValue(): string {
    let value = this.mask;

    const map: Record<string, string> = {
      y: String(this.selectedYear),
      m: String(this.selectedMonth + 1).padStart(2, "0"),
      d: String(this.selectedDay).padStart(2, "0"),
      h: String(this.selectedHour).padStart(2, "0"),
      i: String(this.selectedMinute).padStart(2, "0"),
      s: String(this.selectedSecond).padStart(2, "0")
    };

    Object.entries(map).forEach(([key, val]) => {
      value = value.replace(new RegExp(`${key}+`, "g"), val);
    });

    return value;
  }

  protected inRange(v: number, min: number, max: number): boolean {
    return v >= min && v <= max;
  }

  /**
   * Инициализация компонента
   * 1. Установка необходимых этапов
   * 2. Определение и установка первого этапа
   */
  protected initializeSteps(): void {
    this.availableSteps = [];

    if (this.needsYear) this.availableSteps.push("decade", "year");
    if (this.needsMonth) this.availableSteps.push("month");
    if (this.needsDay) this.availableSteps.push("day");
    if (this.needsTime) this.availableSteps.push("time");

    this.currentStep = this.availableSteps.includes(this.startStep)
        ? this.startStep
        : this.availableSteps[0];
  }

  /**
   * Заполнить компонент текущей датой
   */
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

  /**
   * Разбор даты в соответствии с маской
   */
  protected parseValue(value: string): void {
    const regex = this.prepareMaskToRegex(this.mask)
    const match = value.match(new RegExp(`^${regex}$`));

    if (!match) {
      this.setCurrentDate();
      return;
    }

    let index = 1;
    const next = (char: string) =>
        this.mask.includes(char) ? Number(match[index++]) : undefined;
    const day = next("d");
    const month = next("m");
    const year = next("y");
    const hour = next("h");
    const minute = next("i");
    const second = next("s");

    if (year) this.selectedYear = year;
    if (month) this.selectedMonth = month - 1;
    if (day) this.selectedDay = day;

    this.selectedHour = hour ?? 0;
    this.selectedMinute = minute ?? 0;
    this.selectedSecond = second ?? 0;

    this.selectedDecade = Math.floor(this.selectedYear / 10) * 10;

    this.clampDay();
    this.validateTime();
  }

  protected prepareMaskToRegex(mask: string): string {
    const map: Record<string, string> = {
      y: "(\\d{4})",
      m: "(\\d{1,2})",
      d: "(\\d{1,2})",
      h: "(\\d{1,2})",
      i: "(\\d{1,2})",
      s: "(\\d{1,2})",
    };

    let regex = "";
    let i = 0;
    while (i < mask.length) {
      const char = mask[i];

      if (map[char]) {
        while (mask[i + 1] === char) i++;
        regex += map[char];
      } else {
        regex += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      i++;
    }

    return regex;
  }

  protected clampDay(): void {
    const max = new Date(
        this.selectedYear,
        this.selectedMonth + 1,
        0
    ).getDate();

    if (this.selectedDay > max) {
      this.selectedDay = max;
    }
  }

  protected validateTime(): void {
    this.selectedHour = Math.min(23, Math.max(0, this.selectedHour));
    this.selectedMinute = Math.min(59, Math.max(0, this.selectedMinute));
    this.selectedSecond = Math.min(59, Math.max(0, this.selectedSecond));
  }

  /**
   * Вернуть установленную дату значение
   */
  protected emitValue(): void {
    this.handleInput({
      target: {value: this.formattedValue()}
    } as unknown as Event);
  }

  /**
   * ВКЛ/ВЫКЛ окно выбора
   */
  public togglePicker(e: MouseEvent): void {
    e.stopPropagation();
    this.showPicker ? this.closePicker() : this.openPicker();
  }

  /**
   * включить окно выбора
   */
  public openPicker(): void {
    this.initializeSteps();
    this.showPicker = true;

    this.$nextTick(() => {
      document.addEventListener("click", this.handleClickOutside);
    });
  }

  /**
   * Обработка события нажатия вне окна выбора даты и времени
   */
  protected handleClickOutside(event: MouseEvent): void {
    const target = event.target as Node;

    const picker = this.$refs.pickerRef as HTMLElement;
    const input = this.$refs.inputRef as HTMLElement;

    if (
        picker &&
        !picker.contains(target) &&
        input &&
        !input.contains(target)
    ) {
      this.closePicker();
    }
  }

  /**
   * Переключение на предыдущий этап
   */
  protected previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStep = this.availableSteps[this.currentStepIndex - 1];
    }
  }

  /**
   * Переключение на следующий этап
   */
  protected nextStep(): void {
    if (!this.canProceed) return;

    if (this.currentStepIndex < this.availableSteps.length - 1) {
      this.currentStep = this.availableSteps[this.currentStepIndex + 1];
      return;
    }

    this.applySelection();
  }

  /**
   * Закрыть окно компонента
   */
  public closePicker(): void {
    this.showPicker = false;
    document.removeEventListener("click", this.handleClickOutside);
  }

  /**
   * Применить изменения из компонента
   */
  protected applySelection(): void {
    this.validateTime();
    this.emitValue();
    this.closePicker();
  }

  /**
   * Выбрать десятилетие
   */
  protected selectDecade(v: number) {
    this.selectedDecade = v;
    this.nextStep();
  }

  /**
   * Выбрать год
   */
  protected selectYear(v: number) {
    this.selectedYear = v;
    this.nextStep();
  }

  /**
   * Выбрать месяц
   */
  protected selectMonth(v: number) {
    this.selectedMonth = v;
    this.clampDay();
    this.nextStep();
  }

  /**
   * Выбрать день
   */
  protected selectDay(v: number) {
    this.selectedDay = v;
    this.nextStep();
  }

  mounted(): void {
    this.initializeSteps();
    this.emitValue();
  }

  beforeUnmount(): void {
    document.removeEventListener("click", this.handleClickOutside);
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
