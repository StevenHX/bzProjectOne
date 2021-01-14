<template>
    <div :class="['l-menu',{'l-menu-iscollapse':isCollapse}]">
        <template v-for="(item) in leftMenu">
            <el-submenu popper-class="bz-submenu-popper" :index="item.path" :key="item.name" v-if="item.meta&&item.meta.isExpand">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <l-menu :left-menu="item.children" :isCollapse="isCollapse" @toPage="toPage"></l-menu>
            </el-submenu>
            <el-menu-item :index="item.path"
                :key="item.name"
                @click="toPage(item.path)"
                v-else-if="item.meta&&item.meta.isMenu">
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </div>
</template>


<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component({
        name: 'LMenu'
    })
    export default class InsetBack extends Vue {
        @Prop({
            type: Array,
            default: ()=>{
                return [];
            }
        })
        leftMenu!: any;

        @Prop({
            type: Boolean,
            default: false
        })
        isCollapse!: boolean;

        toPage(path:string) {
            this.$emit('toPage', path)
        }
    }
</script>

<style scoped lang="scss">
    .l-menu {
        background-color:#f5f5f5;
        ::v-deep .el-submenu__title {
            color: $grey-dark;

            &:hover {
                background-color: #f5f5f5;
            }
        }

        ::v-deep .el-menu {
            background-color: inherit;
        }

        &.l-menu-iscollapse {
            ::v-deep .el-submenu__title, .el-menu-item {
                color: $grey-dark;
                &:hover {
                    color:$grey-dark;
                    >i{
                        color:$grey-dark;
                    }

                }
            }
        }

        .bz-submenu-popper{
            ::v-deep .el-submenu__title, .el-menu-item {
                background-color: $white;
            }
        }

        i {
            width: 24px;
            display: inline-block;
        }

        .el-menu-item {
            height: 50px;
            line-height: 50px;
            color: $grey-dark;

            &:hover {
                background-color: $bg-primary-hover;
            }

            &.is-active {
                color: $white;
                @include gradient-color-tb(#224157, #40566b);
                box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);
                transition: 0s;
                position: relative;
            }
        }
    }
</style>

