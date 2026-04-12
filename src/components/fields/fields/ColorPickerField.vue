<template>
  <div :class="[(label.error ? 'validate-error' : ''), 'color-picker-field']">
    <label :for="label.title">{{ label.title }}</label>
    <div class="input-container">
      <button
          class="color-picker-btn"
          :style="{backgroundColor: this.label?.value}"
          v-on:click="togglePicker"
      ></button>
      <div
          :class="[isShowPicker ? '' : 'hide', 'picker']"
          :style="pickerPositionStyle"
          ref="pickerElement"
      >
        <div
            class="block-picker"
            ref="colorPicker"
            @mousedown="startColorDrag"
            :style="pickerGradient"
        >
          <div class="block-picker-inner">
            <div
                class="color-selector"
                :style="{ left: colorX + 'px', top: colorY + 'px', backgroundColor: currentColor }"
            ></div>
          </div>
        </div>

        <div
            class="line"
            ref="huePicker"
            @mousedown="startHueDrag"
        >
          <div
              class="hue-slider"
              :style="{ left: huePosition + 'px' }"
          ></div>
        </div>
        <div class="picker-info">
          <p>HEX: {{ currentColor }}</p>
        </div>

        <button class="select-button" @click="handleInputPicker">Выбрать</button>
      </div>
      <input
          :id="name"
          :name="name"
          :required="label.required"
          :placeholder="label.placeholder"
          :type="label.type"
          :value="label?.value"
          @input="handleInput"
      />
    </div>
    <div v-if="label.error" class="validate-message"><span>{{ label.error }}</span></div>
  </div>
</template>

<script lang="ts">
import {Options} from 'vue-class-component';
import {Label} from '@/utility/interfaces/label.interface';
import BaseField from "@/components/fields/fields/BaseField";

@Options({
  props: {
    label: Object as () => Label,
    name: String,
  },
})
export default class ColorPickerField extends BaseField {
  isShowPicker = false;
  currentColor: string = "#000000";

  hue = 0;
  saturation = 1;
  lightness = 0.5;

  huePosition = 0;
  colorX = 0;
  colorY = 0;

  isDraggingHue = false;
  isDraggingColor = false;

  pickerPositionStyle: { [key: string]: string } = {};
  pickerElement: HTMLElement | null = null;

  declare $refs: {
    huePicker: HTMLElement;
    colorPicker: HTMLElement;
    pickerElement: HTMLElement;
  };

  get pickerGradient() {
    return {
      background: `linear-gradient(to top, #000, transparent),
                  linear-gradient(to right, #fff, hsl(${this.hue}, 100%, 50%))`
    };
  }

  public handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.$emit("handleInput", inputElement.value);
  }

  public handleInputPicker(): void {
    this.label.value = this.currentColor;
    this.$emit("handleInput", this.currentColor);

    this.isShowPicker = !this.isShowPicker;
  }

  togglePicker(event: Event) {
    event.stopPropagation();
    this.isShowPicker = !this.isShowPicker;
    if (this.isShowPicker) {
      this.$nextTick(() => {
        this.calculatePickerPosition();
        setTimeout(() => {
          document.addEventListener('click', this.handleClickOutside);
        }, 0);
      });
    } else {
      document.removeEventListener('click', this.handleClickOutside);
    }
  }

  handleClickOutside(event: MouseEvent) {
    const pickerElement = this.pickerElement;
    const buttonElement = this.$el.querySelector('.color-picker-btn') as HTMLElement;

    if (!pickerElement || !buttonElement) return;

    const target = event.target as Node;
    const isClickInsidePicker = pickerElement.contains(target);
    const isClickOnButton = buttonElement.contains(target) || target === buttonElement;

    if (!isClickInsidePicker && !isClickOnButton) {
      this.closePicker();
    }
  }

  closePicker() {
    this.isShowPicker = false;
    document.removeEventListener('click', this.handleClickOutside);
  }

  calculatePickerPosition() {
    const button = this.$el.querySelector('.color-picker-btn') as HTMLElement;
    const picker = this.$el.querySelector('.picker') as HTMLElement;

    if (!button || !picker) return;

    const buttonRect = button.getBoundingClientRect();
    const pickerHeight = picker.offsetHeight;
    const viewportHeight = window.innerHeight;

    const spaceAbove = buttonRect.top;
    const spaceBelow = viewportHeight - buttonRect.bottom;

    const safetyMargin = 10;

    if (spaceAbove >= pickerHeight + safetyMargin) {
      this.pickerPositionStyle = {
        top: 'auto',
        bottom: '100%',
        left: '0',
        marginBottom: '10px'
      };
    } else if (spaceBelow >= pickerHeight + safetyMargin) {
      this.pickerPositionStyle = {
        top: '100%',
        bottom: 'auto',
        left: '0',
        marginTop: '10px'
      };
    } else {
      if (spaceAbove > spaceBelow) {
        this.pickerPositionStyle = {
          top: '0',
          bottom: 'auto',
          left: '0',
          marginTop: '0'
        };
      } else {
        this.pickerPositionStyle = {
          top: '100%',
          bottom: 'auto',
          left: '0',
          marginTop: '10px',
          maxHeight: `${spaceBelow - safetyMargin}px`
        };
      }
    }
  }

  startHueDrag(event: MouseEvent) {
    this.isDraggingHue = true;
    this.updateHuePosition(event);
  }

  startColorDrag(event: MouseEvent) {
    this.isDraggingColor = true;
    this.updateColorPosition(event);
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDraggingHue) {
      this.updateHuePosition(event);
    } else if (this.isDraggingColor) {
      this.updateColorPosition(event);
    }
  }

  handleMouseUp() {
    this.isDraggingHue = false;
    this.isDraggingColor = false;
  }

  updateColorPosition(event: MouseEvent) {
    const rect = this.$refs.colorPicker.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));

    this.colorX = x;
    this.colorY = y;

    this.saturation = x / rect.width;
    this.lightness = (1 - (y / rect.height)) * (1 - 0.5 * (x / rect.width));
    this.updateColorFromHSL();
  }

  updatePickerPositions() {
    if (this.label.value) {
      const hsl = this.hexToHsl(this.label.value as string);
      this.hue = hsl.h;
      this.saturation = hsl.s / 100;
      this.lightness = hsl.l / 100;

      this.currentColor = this.label.value as string;
    }

    this.huePosition = (this.hue / 360) * (this.$refs.huePicker?.offsetWidth || 200);

    const rectWidth = 200;
    const rectHeight = 200;

    this.colorX = this.saturation * rectWidth;

    if (this.saturation === 0) {
      this.colorY = (1 - this.lightness) * rectHeight;
    } else {
      const denominator = 1 - 0.5 * this.saturation;
      if (denominator !== 0) {
        this.colorY = (1 - (this.lightness / denominator)) * rectHeight;
      } else {
        this.colorY = 0;
      }
    }

    // Ограничиваем значения в пределах picker
    this.colorX = Math.max(0, Math.min(rectWidth, this.colorX));
    this.colorY = Math.max(0, Math.min(rectHeight, this.colorY));
  }

  updateColorFromHSL() {
    this.currentColor = this.hslToHex(this.hue, this.saturation * 100, this.lightness * 100);
  }

  hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  hexToHsl(hex: string): { h: number; s: number; l: number } {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  updateHuePosition(event: MouseEvent) {
    const rect = this.$refs.huePicker.getBoundingClientRect();
    let x = event.clientX - rect.left;
    x = Math.max(0, Math.min(rect.width, x));

    this.huePosition = x;
    this.hue = (x / rect.width) * 360;
    this.updateColorFromHSL();
  }

  mounted() {
    super.mounted();

    this.currentColor = this.label.value as string;

    this.updatePickerPositions();

    this.updatePickerPositions();
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('resize', this.calculatePickerPosition);

    this.$nextTick(() => {
      this.pickerElement = this.$refs.pickerElement as HTMLElement;

      this.updatePickerPositions();
    });
  }

  beforeUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.calculatePickerPosition);
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style lang="scss" scoped>
.color-picker-field {
  position: relative;

  .input-container {
    margin: 0;
    position: relative;

    input {
      padding-left: 1.5rem;
    }

    .color-picker-btn {
      background-color: transparent;
      border: 1px solid #ccc;
      width: auto;
      aspect-ratio: 1 / 1;
      height: 100%;
      position: absolute;
      left: 0;
      bottom: 2px;
      margin: 0;
      cursor: pointer;
    }

    .picker {
      position: absolute;
      background-color: var(--white);
      z-index: 100;
      width: 220px;
      padding: 12px;
      left: 0;
      bottom: 100%;
      margin-bottom: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

      .block-picker {
        width: 220px;
        height: 200px;
        position: relative;
        cursor: pointer;
        overflow: hidden;

        .block-picker-inner {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .color-selector {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid white;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
          transform: translate(-6px, -6px);
          pointer-events: none;
        }
      }

      .line {
        height: 16px;
        background: linear-gradient(to right,
            #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
        position: relative;
        cursor: pointer;
        margin-bottom: 12px;

        .hue-slider {
          position: absolute;
          width: 0;
          height: 0;
          background: transparent;
          border: none;
          top: -8px;
          transform: translateX(-6px);
          pointer-events: none;
          box-shadow: none;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 8px solid var(--black);
        }
      }

      .picker-info {
        margin: 0;

        & > p {
          margin-top: 0;
        }
      }

      .select-button {
        background: #4a6ee0;
        color: white;
        border: none;
        padding: 6px 12px;
        cursor: pointer;
        width: 100%;
        font-size: 14px;

        &:hover {
          background: #3a5ec9;
        }
      }

      &.hide {
        display: none;
      }
    }
  }

  .validate-message {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>