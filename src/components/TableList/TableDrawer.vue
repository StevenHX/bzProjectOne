<template>
    <div class="wt-el-drawer">
        <el-drawer
            :size="formDrawerSize"
            :title="isAddDrawer?'新增':'编辑'"
            :visible.sync="formDrawerOpen"
            :show-close="false"
            :before-close="close">
            <el-form class="wt-el-drawer-form"
                :model="formData"
                ref="tableForm"
                v-loading="Loading&&!isAddDrawer"
                :label-width="formDrawerlabel">
                <div v-for="res in formDrawerRow.setting" :key="res.key">
                    <el-form-item :label="res.name"
                        :prop="res.key"
                        :rules="{required: (res.valid===false||!res.mold)?false:true,  message: res.validator?undefined:messageTip[res.mold]+res.name,validator: res.validator||undefined,trigger: 'blur'}">
                        <el-input v-if="res.mold==='input'"
                            v-model="formData[res.key]"
                            :placeholder="messageTip[res.mold]+res.name"
                            :title="formData[res.key]">
                        </el-input>
                        <el-date-picker v-if="res.mold==='date'"
                            v-model="formData[res.key]"
                            :value-format="res.format"
                            type="date"
                            :placeholder="messageTip[res.mold]+res.name">
                        </el-date-picker>
                        <el-select v-if="res.mold==='select'||res.mold==='selectText'"
                                v-model="formData[res.key]"
                                :disabled="res.mold==='selectText'"
                                :placeholder="messageTip[res.mold]?messageTip[res.mold]+res.name:''"
                                :title="formData[res.key]"
                                :class="res.mold">
                            <template >
                                <el-option v-for="item in ENUMS[res.dataEnum]"
                                    :key="item[res.dataEnumType?res.dataEnumType.Code:'Value']"
                                    :label="item[res.dataEnumType?res.dataEnumType.Name:'Text']"
                                    :value="item[res.dataEnumType?res.dataEnumType.Code:'Value']">
                                </el-option>
                            </template>
                        </el-select>
                        <template v-if="res.mold==='switch'">
                            <el-switch
                                v-model="formData[res.key]"
                                @change="(e) => formData[res.key] = e"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </template>
                        <template v-if="res.mold==='buttons' && formDrawerData">
                            <el-tooltip v-for="item in res.items" :key="item.tip" effect="dark" :content="item.tip" placement="top">
                                <el-button :type="item.type" @click="buttonChange($event,item,)" :icon="item.icon" :circle="item.circle">{{item.name}}
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-form-item>
                </div>
                <el-form-item class="wt-el-drawer-footer">
                    <el-button type="primary" :loading="saveLoading" @click="submitForm()">确定</el-button>
                    <el-button @click="close()">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>


<script lang="ts">
    import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
    import {Getter, Action, namespace, State} from 'vuex-class';
    import _ from 'lodash'
    import m from 'moment'
    import {traversingTree, listIsCheck, getKeyData} from '@/util';
    import {api} from "@/api";
    import axios from 'axios';

    @Component({
        name: 'TableDrawer',
    })
    export default class TableDrawer extends Vue {
        public $refs!: {
            tableForm: HTMLFormElement
        };

        @State('ENUMS')
        ENUMS!: any;

        @State('ORG')
        ORG!: any;

        @State('POSITION')
        POSITION!: any;

        @Prop({
            type: String,
            default: '360px'
        })
        formDrawerSize!: string;

        @Prop({
            type: String,
            default: '250px'
        })
        innerDrawerSize!: string;

        @Prop({
            type: String,
            default: '80px'
        })
        formDrawerlabel!: string;

        //标题文字
        @Prop({
            type: Boolean,
            default: false
        })
        isAddDrawer!: false;

        //开关抽屉
        @Prop({
            type: Boolean,
            default: false
        })
        formDrawerOpen!: false;

        //行配置
        @Prop({
            type: Object,
            default: () => {
                return {}
            }
        })
        formDrawerRow!: any;

        //行数据
        @Prop({
            type: Object,
            default: () => {
                return {}
            }
        })
        formDrawerData!: any;

        @Watch('formDrawerOpen')
        watchFormDrawerOpen(data: any) {
            data ? (this.isAddDrawer ? this.initInfo() : this.getInfo()) : '';
        }
        innerDrawer:boolean = false;
        Loading: boolean = false;
        saveLoading: boolean = false;
        isShowLockAccount: boolean = false;
        accountNumber:any = '';
        passWord:any = '';
        formData: any = {};
        subMenuData: any = [];
        messageTip: any = {
            input: '请输入',
            select: '请选择',
            tree: '请选择',
            cascader: '请选择',
            date: '请选择',
            switch: '请选择',
        };
        cascaderList: any = {};

        // 新增初始化数据
        initInfo() {
            let that = this;
            let settingBtns = this.formDrawerRow.setting;
            settingBtns.forEach(function(item:any) {
                if (item.default !== undefined) {
                    that.formData[item.key] = item.default;
                }
            });
        }
        //编辑查详情
        getInfo() {
            this.Loading = true;
            api[this.formDrawerRow.getApi]({
                data: getKeyData(this.formDrawerData, this.formDrawerRow.getKey)
            }).then((data: any) => {
                this.formData = data.data;
                this.formData.status = this.formData.status === 1;
                this.Loading = false;
            }).finally(() => {
                this.Loading = false;
            })
        }

        //确定
        submitForm() {
            this.$refs.tableForm.validate((valid: boolean) => {
                this.formData.status = this.formData.status? 1:0;
                this.formData.lockStatus = this.formData.lockStatus? 1:0;
                if (valid) {
                    this.saveLoading = true;
                    api[this.formDrawerRow.saveApi]({
                        data: this.formData
                    }).then(() => {
                        this.$refs.tableForm.resetFields();
                        this.$emit('on-drawer-save');
                        this.saveLoading = false;
                    }).finally(() => {
                        this.saveLoading = false;
                    });
                } else {
                    return false;
                }
            });
        }

        //关闭
        close() {
            this.innerDrawer = false;
            this.saveLoading = false;
            this.isShowLockAccount = false;
            this.$refs.tableForm.resetFields();
            this.formData = {};
            this.$emit('on-drawer-close');
        }

        buttonChange(v: any, item: any) {
            this.$emit('buttons-emit',item.emit,this.formDrawerData);
        }
    }
</script>

<style scoped lang="scss">
    .wt-el-drawer {
        ::v-deep .el-drawer {
            .el-drawer__header {
                border-bottom: 1px solid $bd;
                padding: 20px;
                margin-bottom: 0;
            }

            .el-drawer__body {
                height: 100%;
                overflow-y: overlay;
                padding-top: 20px;

                &::-webkit-scrollbar {
                    width: 10px;
                    height: 5px;
                }

                &::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 10px;
                }

                &::-webkit-scrollbar-thumb {
                    background: rgba(196, 199, 204, .8);
                    border-radius: 10px;
                }

                &::-webkit-scrollbar-thumb:hover {
                    background: rgba(196, 199, 204, 1);
                }
            }
        }

        .wt-el-drawer-form {
            padding-right: 30px;

            ::v-deep .el-input {
                width: 220px;
            }

            ::v-deep .el-select{
                &.selectText,&.cascaderText{
                    .el-input__inner{
                        background-color:$white;
                        border-color:$white;
                        color: $grey-dark;
                        cursor: auto;
                    }
                    .el-input__suffix{
                        display: none;
                    }
                }
            }

            .wt-el-drawer-footer {
                width: calc(100% + 30px);
                height: 50px;
                background-color: $white;
                border-top: 1px solid $bd;
                margin-bottom: 0;
                position: sticky;
                bottom: 0;
                left: 0;
                display: flex;
                align-items: center;
            }
        }
    }
</style>
