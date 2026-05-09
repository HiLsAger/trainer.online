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
    </div>
    <template v-if="isSelectTrainingRoom && trainingSheetSettings">
      <div class="weekline-sticky">
        <div class="weekline-inner">
          <WeekLineComponent
              :key="resetWeekLineTrigger"
              nowWeek="now"
              @change="setSelectedWeekDateInterval"
          />
        </div>
      </div>
      <div class="training-sheet-wrapper">
        <div class="training-sheet-table">
          <div class="time-column">
            <div style="height: 40px;"></div>
            <div class="main-time-line"></div>
            <div
                v-if="hoverTime"
                class="hover-indicator"
                :style="{ top: hoverPosition + 40 + 'px' }"
            >
              <div class="hover-dot"></div>
              <div class="hover-label">{{ hoverTime }}</div>
            </div>
            <div
                class="time-label"
                v-for="time in visibleTimeList"
                :key="time"
            >{{ time }}
            </div>
          </div>
          <div class="days-container">
            <div class="header-row">
              <div
                  class="day-header"
                  :class="{today: isToday(date.date)}"
                  v-for="date in dateOfWeekList"
                  :key="date.date.toISOString()"
                  v-html="date.displayDate"
              />
            </div>
            <div class="days-body" :style="{ height: schedulerHeight + 'px' }">
              <div
                  class="day-column"
                  v-for="date in dateOfWeekList"
                  :key="date.date.toISOString()"
                  @mousemove="handleMouseMove($event, date.date)"
                  @mouseleave="handleMouseLeave"
                  @click="handleFreeZoneClick(date.date)"
              >
                <div
                    v-for="training in getDaySchedule(date.date)"
                    :key="training.schedule_rule_id"
                    class="training-event"
                    :style="[training.style.css, getTrainingStyle(training)]"
                    @click.stop="editTraining(training)"
                >
                  <div class="training-title">{{ training.training_name }}</div>
                  <div class="training-trainer">{{ training.trainer_name }}</div>
                  <div class="training-time">{{ training.time }}</div>
                  <div class="training-price">{{ training.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <transition name="fade">
      <ModalComponent
          v-if="modalForm && modalForm.labels"
          :key="formChangeKey"
          :form="modalForm"
          :show="isShowModal"
          @handleInputUpdate="handleInputUpdateModal"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import FieldsComponent from "@/components/fields/FieldComponent.vue";
import ModalComponent from "@/components/modal/Modal.vue";
import AxiosHelper from "@/core/helpers/Axios.helper";
import DateHelper from "@/core/helpers/Date.helper";
import {Form} from "@/utility/interfaces/label.interface";
import {ScheduleInterface} from "@/core/helpers/interfaces/schedule.interface";
import {reactive} from "vue";
import WeekLineComponent from "@/components/weekline/WeekLine.vue";
import ToasterHelper from "@/core/helpers/Toaster.helper";

@Options({
  components: {FieldsComponent, ModalComponent, WeekLineComponent}
})
export default class TrainingSheetView extends Vue {
  protected pxPerMinute: number = 1.2;
  protected snapDistance: number = 10;

  protected fieldsCounter: number = 0;
  protected axiosHelper: AxiosHelper | null = null;
  protected toasterHelper: ToasterHelper | null = null;
  protected formChangeKey: number = 0;
  protected isShowModal: boolean = false;
  protected modalForm: Form | null = null;
  protected trainingSheetSettings: Record<string, any> = {};
  protected formData: Record<string, any> = {};
  protected visibleTimeList: string[] = [];
  protected hoverTime: string | null = null;
  protected hoverDate: Date | null = null;
  protected hoverPosition: number = 0;
  protected schedule: Record<string, ScheduleInterface[]> =
      reactive<Record<string, ScheduleInterface[]>>({});
  protected dateOfWeekList: { displayDate: string, date: Date }[] = [];
  protected resetWeekLineTrigger: number = 0;
  protected currentWeekDate: Date = new Date();

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
        value: '@COOKIE'
      }
    }
  };
  protected baseForm: Form = {
    alias: "trainings-sheet-form",
    action: 'schedules/schedule',
    method: 'POST',
    labels: {
      training_id: {
        title: 'Тренировка',
        placeholder: 'Тренировка',
        templateType: 'select',
        type: 'number',
        list: 'fields/trainings',
        required: true
      },
      start_time: {
        title: 'Время начала',
        placeholder: 'чч:мм',
        templateType: 'datetime',
        required: true,
        options: {
          mask: 'h:i'
        }
      },
      duration: {
        title: 'Длительность',
        placeholder: 'чч:мм',
        templateType: 'datetime',
        required: true,
        value: '01:00',
        options: {
          mask: 'h:i'
        }
      },
      start_date: {
        title: 'Дата',
        placeholder: 'дд.мм.гггг',
        templateType: 'datetime',
        required: true,
        options: {
          mask: 'd.m.y',
          convert: 'y-m-d'
        }
      },
      end_date: {
        title: 'Дата окончания',
        placeholder: 'дд.мм.гггг',
        templateType: 'datetime',
        required: true,
        options: {
          mask: 'd.m.y',
          convert: 'y-m-d'
        }
      },
      price: {
        title: 'Цена',
        templateType: 'text',
        type: 'number',
        value: 0
      },
      always: {
        title: 'Всегда',
        templateType: 'checkbox',
        value: true
      },
      training_room_id: {
        title: null,
        templateType: 'text',
        type: 'hidden'
      }
    }
  };

  protected get isSelectTrainingRoom(): boolean {
    return !!this.formData['training_room_id'];
  }

  protected isToday(date: Date): boolean {
    const now = new Date();

    return now.getFullYear() === date.getFullYear()
        && now.getMonth() === date.getMonth()
        && now.getDate() === date.getDate();
  }

  protected timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  protected minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  protected prepareDate(date: Date): string {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }

  protected getDaySchedule(date: Date): ScheduleInterface[] {
    const key = date.toISOString().slice(0, 10);
    return this.schedule[key] || [];
  }

  protected getTrainingStyle(training: ScheduleInterface): Record<string, string> {
    const baseStart = Number(this.trainingSheetSettings['startTimeTrainingSheet']);
    const start = this.timeToMinutes(training.time);
    const top = (start - baseStart) * this.pxPerMinute;
    const height = training.duration * this.pxPerMinute;
    return {
      top: `${top}px`,
      height: `${height}px`,
      background: training.style.background_color ?? '',
      color: training.style.color ?? '',
      'font-size': training.style.font_size ?? ''
    };
  }

  protected getSnappedMinutes(date: Date, currentMinutes: number): number {
    const trainings = this.getDaySchedule(date);
    for (const training of trainings) {
      const start = this.timeToMinutes(training.time);
      const end = start + training.duration;

      if (Math.abs(currentMinutes - start) <= this.snapDistance) {
        return start;
      }

      if (Math.abs(currentMinutes - end) <= this.snapDistance) {
        return end;
      }
    }
    return currentMinutes;
  }

  protected handleMouseMove(event: MouseEvent, date: Date): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const y = event.clientY - rect.top;
    this.hoverPosition = y;
    const startMinutes = Number(
        this.trainingSheetSettings['startTimeTrainingSheet']
    );
    let currentMinutes = startMinutes + Math.floor(y / this.pxPerMinute);
    currentMinutes = this.getSnappedMinutes(date, currentMinutes);
    this.hoverTime = this.minutesToTime(currentMinutes);
    this.hoverDate = date;
  }

  protected handleMouseLeave(): void {
    this.hoverTime = null;
    this.hoverDate = null;
  }

  protected hasCollision(
      date: Date,
      startTime: string,
      duration: number
  ): boolean {
    const start = this.timeToMinutes(startTime);
    const end = start + duration;
    return this.getDaySchedule(date)
        .some(training => {
          const itemStart = this.timeToMinutes(training.time);
          const itemEnd = itemStart + training.duration;
          return (start < itemEnd && end > itemStart);
        });
  }

  protected get schedulerHeight(): number {
    const start = Number(this.trainingSheetSettings['startTimeTrainingSheet']);
    const end = Number(this.trainingSheetSettings['endTimeTrainingSheet']);

    return (end - start) * this.pxPerMinute;
  }

  protected handleFreeZoneClick(date: Date): void {
    if (!this.hoverTime) {
      return;
    }

    const duration = 60;
    const selectedDate = new Date(date);
    if (this.hasCollision(selectedDate, this.hoverTime, duration)) {
      this.toasterHelper?.addErrorToast('Это время уже занято')
      return;
    }

    this.showModal(this.hoverTime, selectedDate);
  }

  protected showModal(startTime: string, startDate: Date): void {
    const form = JSON.parse(JSON.stringify(this.baseForm));
    const currentDate = this.prepareDate(startDate);
    form.title = 'Создать тренировку';
    form.labels.start_time.value = startTime;
    form.labels.start_date.value = currentDate;
    form.labels.end_date.value = currentDate;
    form.labels.training_room_id.value = this.formData['training_room_id'];
    this.modalForm = form;
    this.isShowModal = true;
    this.formChangeKey++;
  }

  protected editTraining(
      training: ScheduleInterface
  ): void {

    console.log(training);
  }

  protected setSelectedWeekDateInterval(
      dateInterval: {
        startDate: Date,
        endDate: Date
      }
  ): void {
    this.currentWeekDate = new Date(dateInterval.startDate);
    this.generateDaysOfWeek();
    this.loadSchedule();
  }

  protected handleInputUpdate(
      data: Record<string, any>
  ): void {
    this.formData = data;
    this.loadSchedule();
  }

  protected handleInputUpdateModal(
      data: Record<string, any>
  ): void {
    if (!this.modalForm) {
      return;
    }

    this.modalForm.labels['end_date'].hidden = !!(data.always || data.always === undefined);
    this.loadSchedule();
  }

  protected generateVisibleTimeList(): void {
    const start = Number(this.trainingSheetSettings['startTimeTrainingSheet']);
    const end = Number(this.trainingSheetSettings['endTimeTrainingSheet']);
    this.visibleTimeList = [];
    for (let m = start; m < end; m += 60) {
      this.visibleTimeList.push(this.minutesToTime(m));
    }
  }

  protected generateDaysOfWeek(): void {
    const settingsDays = this.trainingSheetSettings?.dayOfWeekInTable;
    if (!settingsDays) {
      return;
    }

    const list: { displayDate: string, date: Date }[] = [];
    const mondayDate = DateHelper.getStartDayOfWeekDateByDate(
        this.currentWeekDate.toISOString().split('T')[0]
    );
    const date = new Date(mondayDate);
    const map: Record<string, string> = {
      monday: "ПН",
      tuesday: "ВТ",
      wednesday: "СР",
      thursday: "ЧТ",
      friday: "ПТ",
      saturday: "СБ",
      sunday: "ВС"
    };
    Object.entries(settingsDays).forEach(([index, value]) => {
      if (value) {
        const isToday = new Date().toDateString() === date.toDateString();
        list.push({
          displayDate: `${map[index]} ${date.toLocaleDateString()}`,
          date: new Date(date), isToday
        } as any);
      }

      date.setDate(date.getDate() + 1);
    });

    this.dateOfWeekList = list;
  }

  protected async loadSettings(): Promise<void> {
    if (!this.axiosHelper) {
      return;
    }

    this.trainingSheetSettings = await this.axiosHelper.sendGetRequest(
        'trainings-sheet/settings'
    ) as Record<string, any>;
  }

  protected async loadSchedule(): Promise<void> {

    if (!this.axiosHelper) {
      return;
    }

    const firstDate = this.dateOfWeekList[0]?.date;
    const lastDate = this.dateOfWeekList[this.dateOfWeekList.length - 1]?.date;

    if (!firstDate || !lastDate || !this.formData['training_room_id']) {
      return;
    }

    const data = await this.axiosHelper.sendGetRequest(
        'schedules/schedule',
        {
          start_date: firstDate.toISOString().slice(0, 10),
          end_date: lastDate.toISOString().slice(0, 10),
          training_room_id: this.formData['training_room_id']
        }
    ) as Record<string, ScheduleInterface[]>;

    Object.keys(this.schedule).forEach(key => delete this.schedule[key]);
    Object.entries(data || {}).forEach(
        ([key, value]) => {
          this.schedule[key] = value;
        }
    );
  }

  async mounted(): Promise<void> {
    this.modalForm = JSON.parse(JSON.stringify(this.baseForm));
    this.axiosHelper = await AxiosHelper.getInstance();
    this.toasterHelper = await ToasterHelper.getInstance();
    await this.loadSettings();
    this.generateVisibleTimeList();
    this.currentWeekDate = new Date();
    this.generateDaysOfWeek();
    await this.loadSchedule();
  }
}
</script>

<style lang="scss">
.training-sheet-actions {
  display: flex;
  margin-bottom: 15px;
}

.select-room {
  width: 250px;
}

.training-sheet-table {
  display: flex;
  border: 1px solid var(--gray);
  background: var(--black);
  color: var(--white);
  overflow: visible;
}

.time-column {
  width: 80px;
  position: relative;
  border-right: 1px solid rgba(255, 255, 255, .08);
  box-sizing: border-box;
}

.main-time-line {
  position: absolute;
  top: 40px;
  bottom: 0;
  right: 10px;
  width: 2px;
  background: rgba(255, 255, 255, .15);
}

.time-label {
  height: 72px;
  font-size: 12px;
  padding-top: 2px;
  padding-left: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, .08);
  box-sizing: border-box;
}

.days-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-row {
  display: flex;
  height: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, .08);
}

.day-header {
  flex: 1;
  text-align: center;
  padding-top: 10px;
  border-left: 1px solid rgba(255, 255, 255, .08);
  font-weight: bold;

  .today {
    color: red;
  }
}

.days-body {
  display: flex;
}

.day-column {
  flex: 1;
  position: relative;
  border-left: 1px solid rgba(255, 255, 255, .05);
  overflow: hidden;
  cursor: pointer;
}

.hover-indicator {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 20;
}

.hover-dot {
  position: absolute;
  right: 5px;
  transform: translate(50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff3d3d;
}

.hover-label {
  position: absolute;
  right: 24px;
  top: -10px;
  background: black;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
}

.training-event {
  position: absolute;
  left: 5%;
  width: 90%;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 10;
  transition: .15s;
  color: var(--white);

  &:hover {
    transform: scale(1.02);
    z-index: 15;
  }
}

.training-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.training-trainer,
.training-time,
.training-price {
  font-size: 12px;
  opacity: .9;
}

.training-sheet-wrapper {
  position: relative;
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 180px);
}

.weekline-sticky {
  position: sticky;
  bottom: 0;
  z-index: 200;
  background: var(--black);
  border-top: 1px solid rgba(255, 255, 255, .08);

}

.weekline-inner {
  padding: 10px;
  padding-bottom: 35px;
}
</style>