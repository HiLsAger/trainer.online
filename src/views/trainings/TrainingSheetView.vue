<template>
  <div class="training-sheet">
    <div class="training-sheet-actions">
      <div class="select-room">
        <FieldsComponent
            :key="fieldsCounter"
            ref="fieldsComponentRef"
            :labels="filterForm.labels"
            :alias="filterForm.alias"
            @handleInputFields="handleInputUpdate"
        />
      </div>
      <div class="selected-date">{{ selectedWeekDateInterval.startDate }} - {{ selectedWeekDateInterval.endDate }}</div>
    </div>
    <div class="training-sheet-table" v-if="isSelectTrainingRoom && trainingSheetSettings">
      <div class="empty-cell"></div>
      <div class="header-row table-row">
        <div class="column" v-for="day in daysOfWeek" v-html="day"></div>
      </div>
      <div class="time-column column">
        <div class="time-column-cell cell" v-for="time in timeList">{{ time }}</div>
      </div>
      <div class="training-body-sheet table-row">
        <div class="column" v-for="day in daysOfWeek">
          <div class="cell action-cell" v-for="time in timeList" @click="showModal(time, getDateByDay(day))">
            {{ time }}
          </div>
        </div>
      </div>
      <div class="empty-cell">
        <button @click="resetWeekLineTrigger++" class="btn btn-submit">Сброс
        </button>
      </div>
      <div class="week-line">
        <WeekLineComponent
            :key="resetWeekLineTrigger"
            nowWeek="now"
            @change="setSelectedWeekDateInterval"
        />
      </div>
    </div>
    <transition name="fade">
      <ModalComponent
          v-if="modalForm && modalForm.labels && Object.keys(modalForm.labels).length > 0"
          :key="formChangeKey"
          :form="modalForm"
          :show="true"
          @handleInputUpdate="handleInputUpdateModal"
      >
      </ModalComponent>
    </transition>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import FieldsComponent from "@/components/fields/FieldComponent.vue";
import {Form} from "@/utility/interfaces/label.interface";
import AxiosHelper from "@/core/helpers/Axios.helper";
import ModalComponent from "@/components/modal/Modal.vue";
import DateHelper from "@/core/helpers/Date.helper";
import WeekLineComponent from "@/components/weekline/WeekLine.vue";

@Options({
  components: {WeekLineComponent, ModalComponent, FieldsComponent}
})
export default class TrainingSheetView extends Vue {
  protected fieldsCounter: number = 0;
  protected filterForm: Form = {
    alias: "trainings-sheet",
    title: 'Выбор зала',
    action: 'test',
    method: 'Get',
    labels: {
      trainingRoom: {
        title: 'Зал',
        placeholder: 'Зал',
        templateType: 'select',
        list: 'fields/training-rooms',
        value: '@COOKIE'
      }
    },
  };
  protected baseForm: Form = {
    alias: "trainings-sheet-form",
    labels: {
      training: {
        title: 'Тренеровка',
        placeholder: 'Тренеровка',
        templateType: 'select',
        list: 'fields/trainings',
        required: true
      },
      startTime: {
        title: 'Время начала тренеровки',
        placeholder: 'время чч:мм',
        templateType: 'datetime',
        required: true,
        options: {
          mask: 'h:i'
        }
      },
      startDate: {
        title: 'Дата старата тренеровки',
        placeholder: 'дата дд.мм.гггг',
        templateType: 'datetime',
        required: true,
        options: {
          mask: 'd.m.y'
        }
      },
      endDate: {
        title: 'Дата окончания тренеровки',
        placeholder: 'дата дд.мм.гггг',
        templateType: 'datetime',
        required: true,
        options: {
          mask: 'd.m.y'
        }
      },
      always: {
        title: 'Показывать постоянно?',
        templateType: 'checkbox',
        value: true
      }
    },
    action: '/trainings-sheet/training',
    method: 'POST'
  };

  protected modalForm: Form | null = null;

  protected formData: Record<string, any> = {};
  protected trainingSheetSettings: Record<string, any> = {};
  protected axiosHelper: AxiosHelper | null = null;
  protected timeList: string[] = [];

  protected daysOfWeekMap: Record<string, string> = {
    "monday": "ПН",
    "tuesday": "ВТ",
    "wednesday": "СР",
    "thursday": "ЧТ",
    "friday": "ПТ",
    "saturday": "СБ",
    "sunday": "ВС",
  }
  protected daysOfWeek: string[] = [];
  protected datesOfWeek: Date[] = [];
  protected formChangeKey: number = 0;

  protected resetWeekLineTrigger: number = 0;

  protected _selectedDateInterval: { startDate: Date | null, endDate: Date | null } = {startDate: null, endDate: null}

  protected get isSelectTrainingRoom(): boolean {
    return !!this.formData['trainingroom'];
  }

  protected showModal(startTime: number, startDate: number): void {
    this.modalForm = this.deepCopyForm(this.baseForm);

    this.modalForm.labels['startTime'].value = startTime;
    this.modalForm.labels['startDate'].value = startDate;

    this.formChangeKey++;
  }

  protected deepCopyForm(form: Form): Form {
    return form
  }

  protected getDateByDay(dayString: string): string {
    const index = this.daysOfWeek.findIndex(day =>
        day.includes(dayString.split(' ')[0]) ||
        day.replace(/<[^>]*>/g, '').includes(dayString.split(' ')[0])
    );

    if (index !== -1 && this.datesOfWeek[index]) {
      const date = this.datesOfWeek[index];
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }

  protected handleInputUpdate(data: Record<string, any>) {
    this.formData = data;

    Object.entries(this.formData).forEach(([key, value]) => {
      this.$cookies.set(`${this.filterForm.alias}.${key}`, value);
    });
  }

  protected generateDaysOfWeek(): void {
    if (!this.trainingSheetSettings) {
      console.warn('Training sheet settings not loaded yet');
      return;
    }

    const days: string[] = [];
    const dates: Date[] = [];

    const today = new Date();
    const mondayDate = DateHelper.getStartDayOfWeekDateByDate(today.toISOString().split('T')[0]);

    if (!mondayDate) {
      console.warn('Could not calculate Monday date');
      return;
    }

    const date = new Date(mondayDate);
    Object.entries(this.trainingSheetSettings['dayOfWeekInTable']).forEach(([index, value]) => {
      if (value) {
        const valueDate = this.daysOfWeekMap[index] + " " + date.toDateString();
        days.push(date.toDateString() === today.toDateString() ? `<b>${valueDate}</b>` : valueDate);
        dates.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    });

    this.daysOfWeek = days;
    this.datesOfWeek = dates;
  }

  protected generateTimeList(): void {
    if (!this.trainingSheetSettings) {
      console.warn('Training sheet settings not loaded yet');
      return;
    }

    const timeSectionPeriod = Number(this.trainingSheetSettings['timeSectionPeriod'] ?? 15);
    const startTime = Number(this.trainingSheetSettings['startTimeTrainingSheet'] ?? 540);
    const endTime = Number(this.trainingSheetSettings['endTimeTrainingSheet'] ?? 1140);

    const formatTime = (totalMinutes: number): string => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };

    this.timeList = [];

    for (let minutes = startTime; minutes <= endTime; minutes += timeSectionPeriod) {
      this.timeList.push(formatTime(minutes));
    }
  }

  protected async loadSettings(): Promise<void> {
    this.trainingSheetSettings = (await this.axiosHelper?.sendGetRequest('trainings-sheet/settings')) as Record<string, any>
  }

  protected handleInputUpdateModal(data: Record<string, any>): void {
    if (!this.modalForm) {
      return;
    }

    this.modalForm.labels['endDate'].hidden = !!(data.always || data.always === undefined);
  }

  protected setSelectedWeekDateInterval(dateInterval: { startDate: Date, endDate: Date }): void {
    this._selectedDateInterval = dateInterval;
  }

  protected get selectedWeekDateInterval(): { startDate: Date | null, endDate: Date | null } {
    return this._selectedDateInterval;
  }

  async mounted() {
    this.modalForm = this.deepCopyForm(this.baseForm)
    this.axiosHelper = await AxiosHelper.getInstance();
    await this.loadSettings();
    this.generateTimeList();
    this.generateDaysOfWeek()
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

  .table-row {
    display: flex;
    flex-direction: row;
  }

  .column {
    flex: 1;
    text-align: center;
    border-right: 1px solid var(--black);
    border-left: 1px solid var(--black);

    .cell {
      border-top: 1px solid var(--black);
      border-bottom: 1px solid var(--black);

      &.action-cell:hover {
        cursor: pointer;
        font-weight: bold;
      }
    }
  }

  .empty-cell {
    display: flex;

    .btn {
      margin: auto;
    }
  }
}
</style>