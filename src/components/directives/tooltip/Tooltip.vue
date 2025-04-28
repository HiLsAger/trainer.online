<template>
  <div></div>
</template>

<script lang="ts">
import {DirectiveBinding} from "vue";

const TooltipDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.setAttribute('data-tooltip', binding.value as string);
    el.classList.add('tooltip');
  }
};

export default TooltipDirective;
</script>

<style lang="scss">
[data-tooltip] {
  position: relative;

  &:after {
    display: none;
    position: absolute;
    opacity: 0;
    width: 0;
    top: 0;
    left: 100%;
    max-width: 100px;
    padding: .25em .5em;
    content: attr(data-tooltip);
    color: var(--textColor, #fff);
    background: var(--backgroundColor, #000);
    font-size: .75em;
    z-index: 9999;
  }

  &:hover::after {
    width: fit-content;
    display: block;
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
}
</style>