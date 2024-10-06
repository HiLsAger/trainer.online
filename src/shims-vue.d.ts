/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Добавьте следующее
import { ComponentCustomProperties } from 'vue';
import Settings from './utility/interfaces/settings.interface';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $settings: Settings; // Указываем тип для $config
  }
}