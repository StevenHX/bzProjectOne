<template>
    <view-anim>
        <router-view v-bind="$attrs" v-on="$listeners"/>
    </view-anim>
</template>
<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import ViewAnim from "./ViewAnim.vue";

    @Component({
        name: 'RouterViewAnim',
        components: {ViewAnim}
    })
    export default class RouterViewAnim extends Vue {}
</script>

<style scoped lang="scss">
</style>
