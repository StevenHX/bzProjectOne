<template>
    <div class="wt-el-tree">
        <el-input
                class="wt-sub-ipt"
                placeholder="输入关键字进行过滤"
                v-model="subMenuFilter"
                clearable>
        </el-input>

        <el-tree class="wt-sub-tree scrollBar"
                 :data="formData"
                 :props="subMenuProps"
                 :node-key="subMenuNodeKey"
                 :default-expanded-keys="subMenuExpanded"
                 :filter-node-method="subMenuNode"
                 @node-click="nodeClick"
                 default-expand-all
                 check-strictly
                 :highlight-current="highlightCurrent"
                 ref="tree">
            <div class="custom-tree-node" slot-scope="{ node, data }">
                <span class="custom-tree-node-name">{{ node.label }}</span>
                <div class="custom-tree-node-btn">
                    <template v-for="item in treeSetting.btn">
                        <p :key="item.emit+'_'" v-if="data.machineList">{{data.machineList.length}}台</p>
                        <el-popover
                            v-if="data.machineList"
                            :key="item.emit+'__'"
                            placement="top"
                            width="100"
                            trigger="hover"
                            @show="popoverShow(data.machineList)">

                            <el-radio-group v-model="checkedMachines" v-if="isSingleCheck" @change="handleCheckedCitiesChange(checkedMachines,data.machineList)">
                                <el-radio v-for="item in data.machineList" :label="item" :key="item.id">{{item.machineName}}</el-radio>
                            </el-radio-group>

                            <div v-if="!isSingleCheck">
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange(checkAll,data.machineList)">全选</el-checkbox>
                                <div style="margin: 15px 0;"></div>
                                <el-checkbox-group v-model="checkedMachines" @change="handleCheckedCitiesChange(checkedMachines,data.machineList)">
                                    <el-checkbox v-for="item in data.machineList" :label="item" :key="item.id">{{item.machineName}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        <i
                           :key="item.emit+'___'"
                           :class="item.icon"
                           :title="item.name"
                           slot="reference"
                           @click="clickCustomBtn(data,item)"></i>
                        </el-popover>
                    </template>
                </div>
            </div>
        </el-tree>
    </div>
</template>


<script lang="ts">
    import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
    import _ from 'lodash'

    @Component({
        name: 'TableTree',
    })
    export default class TableTree extends Vue {
        public $refs!: {
            tableForm: HTMLFormElement,
            tree: HTMLFormElement
        };
        
        checkedMachines:any = [];
        checkAll:boolean = false;
        isIndeterminate:boolean = true;
        handleCheckAllChange(checkAll:any, val:any) {
            if (checkAll) {
                this.isIndeterminate = false;
                this.checkedMachines = val;
            } else {
                this.isIndeterminate = true;
                this.checkedMachines = [];
            }
            // console.log(this.checkedMachines);
            this.$emit('on-machine-check', this.checkedMachines)
        }
        handleCheckedCitiesChange(value:any,data:any) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === data.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < data.length;
            // console.log(this.checkedMachines);
            this.$emit('on-machine-check', this.checkedMachines)
        }
        popoverShow(data:any) {
            this.checkedMachines = [];
            let checkedCount = this.checkedMachines.length;
            this.checkAll = checkedCount === data.length;
            this.isIndeterminate = checkedCount < data.length;
            // console.log(this.isIndeterminate);
        }

        @Prop({
            type: Boolean,
            default: true
        })
        highlightCurrent!: false;
        
        @Prop({
            type: Boolean,
            default: false
        })
        isSingleCheck!: false;

        @Prop({
            type: Object,
            default: () => {
                return {}
            }
        })
        treeSetting!: any;

        //数据
        @Prop({
            type: Array,
            default: () => {
                return [];
            }
        })
        subMenuData!: any;

        @Prop({
            type: Object,
            default: () => {
                return {
                    children: 'childList',
                    label: 'groupName'
                }
            }
        })
        subMenuProps!: any;

        @Prop({
            type: String,
            default: ''
        })
        subMenuNodeKey!: any;

        @Prop({
            type: Array,
            default: () => {
                return []
            }
        })
        subMenuNodeName!: any;

        @Prop({
            type: Array,
            default: () => {
                return []
            }
        })
        subMenuExpanded!: any;

        //过滤
        subMenuFilter: string = '';
        formData: any = [];

        @Watch('subMenuFilter', {
            deep: true,
        })
        watchSubMenuFilter(data: number) {
            this.$refs.tree.filter(data);
        }

        @Watch('subMenuData', {
            deep: true,
            immediate: true
        })
        watchSubMenuData(data: any) {
            this.formData = _.cloneDeep(data);
        }

        //过滤菜单
        subMenuNode(value: any, data: any) {
            if (!value) return true;
            let ary: any = [];
            this.subMenuNodeName.map((res: any) => {
                ary.push(data[res].indexOf(value) !== -1);
            });
            return ary.find((res: any) => res === true);
        }

        //选中
        nodeClick(row: any) {
            // if (row.childList.length == 0) {
                this.initChecked(row.id);
                this.$emit('on-tree-check', row)
            // } 
        }

        clickCustomBtn(row: any, data: any) {
            this.$emit(data.emit, row);
        }

        //默认选中
        initChecked(code: string) {
            this.$refs.tree.setCurrentKey(code);
        }

        init() {
            if (this.subMenuData.length) {
                this.initChecked(this.subMenuData[0][this.subMenuNodeKey]);
                this.$emit('on-tree-init', this.subMenuData[0])
            }
        }

        //初始化
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    .wt-el-tree {
        height: 100%;
        position: relative;

        .wt-sub-ipt {
            width: calc(100% - 20px);
            margin-left:10px;
            margin-bottom: 20px;
        }

        .wt-sub-tree {
            height: calc(100% - 50px);
            margin-left:10px;
            padding: 0 20px 50px 0;
            overflow-y: overlay;

            ::v-deep .el-tree-node__content {
                cursor: pointer;

                &:hover {
                    .custom-tree-node-name {
                        opacity: .5;
                    }

                    .custom-tree-node-btn {
                        display: flex;
                        font-size: 12px;
                        font-weight: bold;
                    }
                }
            }

            .custom-tree-node {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;

                .custom-tree-node-name {
                    font-size: 12px;
                    cursor: pointer;

                    label {
                        cursor: pointer;
                    }
                }

                .custom-tree-node-btn {
                    // background-color: #F5F7FA;
                    display: flex;
                    font-size: 12px;
                    font-weight: bold;
                    right: 0;
                    padding: 0 4px 0 12px;
                    i {
                        margin-left: 4px;

                        &:hover {
                            color: $primary;
                        }
                    }
                }
            }
        }

        ::v-deep .el-tree {
            .is-leaf {
                pointer-events: none;
            }

            &.el-tree--highlight-current {
                .el-tree-node.is-current, > .el-tree-node.is-checked:first-of-type {
                    > .el-tree-node__content {
                        background-color: $grey-ll;

                        .custom-tree-node-name {
                            opacity: 1;

                            label {
                                color: $white !important;
                            }
                        }

                        .custom-tree-node-btn {
                            background-color: $grey-ll;
                            color: $white;
                            i {
                                &:hover {
                                    color: $white;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
