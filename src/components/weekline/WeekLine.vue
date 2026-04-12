<template>
  <div class="week-line-content" ref="container">
    <span class="line"></span>
    <div class="week-line-items">
      <span
          v-for="(week, index) in weekLineList"
          :key="index"
          :ref="el => setWeekRef(el, index)"
          :class="[isCurrentWeek(week) ? 'active' : '']"
      ></span>
    </div>
    <div
        class="week-line-selector"
        ref="selector"
        :style="{ left: selectorLeft + 'px' }"
        @mousedown="startDrag"
    >
      <span v-html="currentWeek"></span>
      <div class="triangle"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {IWeekLineSettings, IYearWeek} from "@/components/weekline/interfaces/WeekLineInterface";

@Options({
  props: {
    nowWeek: {
      type: String,
    },
    weekLineSettings: {
      type: Object,
      default: {
        maxWeeksBeforeCurrentWeek: 15,
        maxWeeksAfterCurrentWeek: 30,
      }
    }
  }
})
export default class WeekLineComponent extends Vue {
  nowWeek!: string;
  weekLineSettings!: IWeekLineSettings;

  protected _currentWeek: IYearWeek | null = null;
  protected weekLineList: IYearWeek[] = [];

  protected weekRefs: HTMLElement[] = [];
  protected selectorLeft: number = 0;
  protected isDragging: boolean = false;

  declare $refs: {
    container: HTMLElement;
    selector: HTMLElement;
  };

  set currentWeek(week: string) {
    const weekPattern = /^(\d{4})-(0[1-9]|[1-4][0-9]|5[0-3])$/;

    let weekValue: string;

    if (week === 'now') {
      const now = new Date();
      const year = now.getFullYear();

      const weekNum = this.getWeekNumber(now);

      this._currentWeek = {year: year, week: weekNum};
      return
    }

    if (!weekPattern.test(week)) {
      throw new Error(`Invalid week format. Expected format: YYYY-WW (e.g., 2024-42), got: ${week}`);
    }

    const [, yearStr, weekStr] = week.match(weekPattern)!;
    const year = parseInt(yearStr, 10);
    const weekNum = parseInt(weekStr, 10);

    if (weekNum === 53 && this.getMaxWeekInYear(year) !== 53) {
      throw new Error(`Year ${year} does not have 53 weeks`);
    }

    this._currentWeek = {year: year, week: weekNum};
  }

  get currentWeek(): string {
    return this.getCurrentWeekDateByWeek(this._currentWeek ?? {week: 1, year: 2000});
  }

  protected resetToNow() {
    this.currentWeek = 'now';

    this.recalcWeekLine();

    this.$nextTick(() => {
      this.setSelectorToCurrentWeek();
      this.emitWeek();
    });
  }

  protected getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  protected getMaxWeekInYear(year: number) {
    const lastDayOfYear = new Date(year, 11, 31);

    return this.getWeekNumber(lastDayOfYear);
  }

  protected recalcWeekLine(): void {
    if (!this._currentWeek) {
      this.weekLineList = [];
      return;
    }

    const result: IYearWeek[] = [];

    result.push(this.cloneYearWeek(this._currentWeek));

    let cursor = this.cloneYearWeek(this._currentWeek);
    for (let i = 0; i < this.weekLineSettings.maxWeeksBeforeCurrentWeek; i++) {
      cursor = this.getPrevWeek(cursor);
      result.push(this.cloneYearWeek(cursor));
    }

    cursor = this.cloneYearWeek(this._currentWeek);
    for (let i = 0; i < this.weekLineSettings.maxWeeksAfterCurrentWeek; i++) {
      cursor = this.getNextWeek(cursor);
      result.push(this.cloneYearWeek(cursor));
    }

    this.weekLineList = result.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.week - b.week;
    });
  }

  protected cloneYearWeek(w: IYearWeek): IYearWeek {
    return {
      year: w.year,
      week: w.week,
    };
  }

  protected getPrevWeek(w: IYearWeek): IYearWeek {
    if (w.week > 1) {
      return {year: w.year, week: w.week - 1};
    }

    const prevYear = w.year - 1;
    return {
      year: prevYear,
      week: this.getMaxWeekInYear(prevYear),
    };
  }

  protected getNextWeek(w: IYearWeek): IYearWeek {
    const maxWeek = this.getMaxWeekInYear(w.year);

    if (w.week < maxWeek) {
      return {year: w.year, week: w.week + 1};
    }

    return {
      year: w.year + 1,
      week: 1,
    };
  }

  protected isCurrentWeek(week: IYearWeek): boolean {
    return week.week === this._currentWeek?.week && week.year === this._currentWeek.year
  }

  protected getCurrentWeekDateByWeek(week: IYearWeek): string {
    const startDate = this.getDateOfISOWeek(week.week, week.year);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const format = (date: Date): string => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}.${mm}.${yyyy}`;
    };

    return `${format(startDate)}<br>${format(endDate)}`;
  }

  protected emitWeek() {
    if (!this._currentWeek) return;

    const {startDate, endDate} = this.getWeekDateRange(this._currentWeek);

    this.$emit('change', {startDate, endDate});
  }

  protected getWeekDateRange(week: IYearWeek): { startDate: Date; endDate: Date } {
    const startDate = this.getDateOfISOWeek(week.week, week.year);
    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + 6);

    return {startDate, endDate};
  }

  protected getDateOfISOWeek(week: number, year: number): Date {
    const simple = new Date(year, 0, 4);

    const dayOfWeek = simple.getDay() || 7;

    const monday = new Date(simple);
    monday.setDate(simple.getDate() - dayOfWeek + 1);

    const result = new Date(monday);
    result.setDate(monday.getDate() + (week - 1) * 7);

    return result;
  }

  protected setWeekRef(el: HTMLElement | null, index: number) {
    if (el) this.weekRefs[index] = el;
  }

  protected setSelectorToCurrentWeek() {
    const index = this.weekLineList.findIndex(w =>
        this.isCurrentWeek(w)
    );

    if (index === -1) return;

    const el = this.weekRefs[index];
    if (!el) return;

    this.selectorLeft = el.offsetLeft + el.offsetWidth / 2;
  }

  protected startDrag() {
    this.isDragging = true;

    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.stopDrag);
  }

  protected onDrag = (e: MouseEvent) => {
    if (!this.isDragging) return;

    let closestIndex = 0;
    let minDistance = Infinity;

    this.weekRefs.forEach((el, index) => {
      if (!el) return;

      const distance = Math.abs(e.clientX - el.getBoundingClientRect().left - el.offsetWidth / 2);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    const targetEl = this.weekRefs[closestIndex];
    if (!targetEl) return;

    this.selectorLeft =
        targetEl.offsetLeft + targetEl.offsetWidth / 2;

    this._currentWeek = this.weekLineList[closestIndex];
    this.emitWeek();
  };

  protected stopDrag = () => {
    this.isDragging = false;

    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.stopDrag);
  };

  mounted() {
    this.currentWeek = this.nowWeek;
    this.recalcWeekLine();

    this.$nextTick(() => {
      requestAnimationFrame(() => {
        this.setSelectorToCurrentWeek();
        this.emitWeek();
      });
    });
  }
}
</script>

<style lang="scss">
.week-line-content {
  position: relative;


  .line {
    width: 100%;
    height: 3px;
    position: absolute;
    top: 13px;
    background-color: var(--black);
  }

  .week-line-items {
    height: 30px;
    display: flex;
    justify-content: space-between;

    span {
      margin: auto;
      padding: 5px;

      &.active {
        &::before {
          content: "";
          height: 20px;
          width: 2px;
          background-color: var(--black);
          display: block;
        }
      }

      &::before {
        content: "";
        height: 10px;
        width: 2px;
        background-color: var(--black);
        display: block;
      }

      &:hover {
        cursor: pointer;

        &::before {
          content: "";
          height: 20px;
          width: 2px;
          background-color: var(--black);
          display: block;
        }
      }
    }
  }

  .week-line-selector {
    font-size: 10px;
    position: absolute;
    color: var(--white);
    background-color: var(--black);
    padding: .25rem;
    transition: none;
    transform: translateX(-50%);
    user-select: none;
    -webkit-user-select: none;

    .triangle {
      position: absolute;
      display: flex;
      justify-content: center;
      height: 10px;
      top: -9px;
      width: 100%;
      margin-left: -.25rem;

      &:before {
        content: '';
        display: block;
        border: 5px solid transparent;
        border-bottom: 5px solid var(--black);
      }
    }

    &:hover {
      cursor: grab;
    }
  }
}
</style>
