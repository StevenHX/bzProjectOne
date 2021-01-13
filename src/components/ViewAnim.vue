<template>
    <div class="router-view-anim">
        <transition :name="type" v-if="!$slots.default||$slots.default.length===1">
            <slot></slot>
        </transition>
        <transition-group :name="type" v-else>
            <slot></slot>
        </transition-group>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    @Component({
        name: 'ViewAnim',
        components: {}
    })

    export default class ViewAnim extends Vue {
        @Prop({
            type: String,
            default: 'slide'
        })
        type!: string;
    }
</script>

<style scoped lang="scss">
    .router-view-anim {
        //设置动画时长
        .slide-enter-active {
            transition: 0.3s ease-in-out;
            transition-property: transform,opacity;
        }

        .slide-leave-active {
            transition: 0.2s ease-in;
            transition-property: transform,opacity;
        }

        .slide-enter, .slide-leave-to {
            width: calc(100% - 40px);
            position: absolute;
            opacity: 0;
            transform: translateX(20px)
        }
    }
</style>
