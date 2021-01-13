<template>
    <div class="container">
        <el-drawer
            title="选择区域"
            :append-to-body="appendToBody"
            :size="innerDrawerSize"
            :visible.sync="innerDrawerOpen"
            :before-close="close">
            <table-tree :subMenuData="this.subMenuData"
                        subMenuNodeKey="id"
                        :subMenuNodeName="subMenuNodeName"
                        @on-tree-check="onTreeCheck">
            </table-tree>
        </el-drawer>
    </div>
</template>


<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    @Component({
        components: {
            TreeDrawer
        }
    })
    export default class TreeDrawer extends Vue {
        public $refs!: {
            elTree: HTMLFormElement
        };
        subMenuNodeName: any = ["groupName"];
         @Prop({
            type: Array,
            default: () => {
                return [];
            }
        })
        subMenuData!: any;
        @Prop({
            type: Boolean,
            default: true
        })
        appendToBody!: true;

        @Prop({
            type: Boolean,
            default: false
        })
        innerDrawerOpen!: false;

        @Prop({
            type: String,
            default: '250px'
        })
        innerDrawerSize!: string;

        close() {
            this.$emit('on-drawer-close');
        }

        onTreeCheck(row: any) {
            this.$emit('on-drawer-check',row);
        }

    }
</script>

<style scoped lang="scss">
    .container {
        width:100%;
        padding: 20px;
    }
</style>
