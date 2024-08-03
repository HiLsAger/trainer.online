<template>
    <i :class="[ 'bi', getClass ]"></i>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { RouteRecordRaw } from 'vue-router';

@Options({
    props:{
        routeProperty: Object,
    }
})
export default class BootstrapIcon extends Vue{
    routeProperty!: RouteRecordRaw;

    get getClass(){
        return this.routeProperty.meta && this.routeProperty.meta.bootstrapIconClass 
            ? this.routeProperty.meta.bootstrapIconClass 
            : '';
    }
}
</script>