<template>
    <div class="bz-table">
        <div class="bz-table-sub-menu">
        </div>
        <div class="bz-table-body">
            <div v-if="searchSetting.length" class="bz-tb-search clear">
                <el-form ref="search"
                        :inline="true"
                        @submit.native.prevent
                        class="bz-tb-search-wrapper elementui-custom">
                    <template v-for="item in searchSetting">
                        <br v-if="item.type==='br'" :key="item.key">
                        <el-form-item v-if="item.type !=='br'" :label="item.label"
                                    :key="item.key">
                            <template v-if="item.type==='input'">
                                <el-input v-model="query[item.key]"
                                        :placeholder="item.placeholder"
                                        clearable
                                        :type="item.inputType"
                                        @mousewheel.native.prevent
                                        @keyup.enter.native="onEnter"
                                        @clear="onClear"></el-input>
                            </template>
                            <template v-if="item.type==='select'">
                                <el-select v-model="query[item.key]" placeholder="请选择" filterable>
                                        <el-option
                                            v-for="res in searchDevices"
                                            :key="res.EquipKey"
                                            :label="res.EquipName"
                                            :value="res.EquipKey">
                                        </el-option>
                                </el-select>
                            </template>
                            <template v-if="item.type==='time'">
                                <el-date-picker
                                    v-model="query[item.key]"
                                    type="datetime"
                                    :placeholder="item.placeholder"
                                    default-time="12:00:00"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </template>
                        </el-form-item>
                    </template>
                    <slot name="search"></slot>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="onSearch" class="bz-tb-search-btn">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="onReset" class="bz-tb-search-btn">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="bz-tb-title" v-if="$slots.left||$slots.right">
                <div class="bz-tb-title-left">
                    <slot name="left-machine"></slot>
                    <slot name="left"></slot>
                </div>
                <div class="bz-tb-title-right">
                    <template v-if="showEdit">
                        <el-button v-if="!isEdit"
                                :disabled="!total"
                                @click="onEdit"
                                plain
                                class="bz-tb-edit-btn"
                                icon="el-icon-edit">编辑
                        </el-button>
                        <el-button v-if="isEdit"
                                type="success"
                                @click="onSave"
                                class="bz-tb-edit-btn"
                                icon="el-icon-document-add">保存
                        </el-button>
                    </template>
                    <template v-if="showExport">
                        <el-button
                            @click="onExport"
                            class="bz-tb-edit-btn"
                            icon="el-icon-document">导出
                        </el-button>
                    </template>
                    <slot name="right"></slot>
                </div>
            </div>

            <el-form class="bz-tb-elForm" :model="hotSettings" ref="tableForm" label-width="0px">
                <div class="bz-tb-wrapper">
                    <div class="bz-tb-list"
                        v-loading="loading">
                        <hot-table ref="bzHot"
                                :root="root"
                                :settings="hotSettings"
                                v-show="settings.data.length"></hot-table>
                        <div class="noData" v-if="!total">暂无数据</div>
                    </div>
                    <el-row class="bz-tb-pagination" v-show="total&&hidePaging!==true">
                        <el-col :span="24">
                            <el-pagination
                                    background
                                    @size-change="pageSizeChange"
                                    @current-change="changePageNum"
                                    :current-page="pageNum"
                                    :page-sizes="[10, 20, 50, 100]"
                                    :page-size="pageSize"
                                    layout="total, prev, pager, next, jumper, sizes"
                                    :total="total">
                            </el-pagination>
                        </el-col>
                    </el-row>
                </div>
                <div class="bz-tb-custom" v-if="hotSettings.columns&&hotSettings.columns.length">
                    <div v-for="(res, index) in columnsSub('button')" :key="'res.data' + index">
                        <div v-for="(btem, index) in hotSettings.data"
                            :key="'btem.Id' + index"
                            :ref="res.data+btem[ListId]"
                            class="bz-tb-custom-button">
                            <el-form-item v-for="ptem in res.items"
                                        :key="ptem.emit">
                                <el-tooltip class="item" effect="dark" :content="ptem.tip" placement="top">
                                  <template v-if="res.data === 'VideoUrl'">
                                    <el-button v-if="btem.VideoStatus === 1 && ptem.emit !== 'onUpMp4'" :type="ptem.type" @click="buttonChange($event,ptem,btem)" :icon="ptem.icon" :circle="ptem.circle">{{ptem.name}}
                                    </el-button>
                                    <el-button v-if="btem.VideoReqStatus !== 2 && btem.VideoStatus !== 1 && ptem.emit === 'onUpMp4'" :type="ptem.type" @click="buttonChange($event,ptem,btem)" :icon="ptem.icon" :circle="ptem.circle">{{ptem.name}}
                                    </el-button>
                                  </template>
                                  <template v-else>
                                    <el-button :type="ptem.type" @click="buttonChange($event,ptem,btem)" :icon="ptem.icon" :circle="ptem.circle">{{ptem.name}}
                                    </el-button>
                                  </template>
                                </el-tooltip>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-for="(res, index) in columnsSub('input')" :key="'res.data_' + index">
                        <div v-for="(btem,index) in hotSettings.data"
                            :key="'btem.Id_' + index "
                            :ref="res.data+btem[ListId]"
                            class="elementui-custom">
                            <el-form-item :prop="res.isVerify?('data.' + index + '.'+[res.data]):''"
                                        :rules="{required: true, validator: res.validator||undefined,trigger: 'blur'}">
                                <el-input v-model="btem[res.data]"
                                        disabled
                                        :placeholder="!res.isEdit?'':'请输入内容'"
                                        :title="btem[res.data]"
                                        @change="iptChange($event,res,btem)"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-for="(res, index) in columnsSub('select')" :key="'res.data__' + index">
                        <div v-for="(btem,index) in hotSettings.data"
                            :key="'btem.Id__' + index"
                            :ref="res.data+btem[ListId]"
                            class="elementui-custom">
                            <el-form-item
                                    :prop="res.isVerify?('data.' + index + '.'+[res.data]):''"
                                    :rules="{required: true, validator: res.validator||undefined, trigger: 'change'}">
                                <el-select v-model="btem[res.data]"
                                        :placeholder="!res.isEdit?'':'请选择'"
                                        filterable
                                        :disabled="!res.isEdit"
                                        @change="selChange($event,res,btem)">
                                    <el-option
                                            v-for="item in res.dataEnum?ENUMS[res.dataEnum]:[]"
                                            :key="item.Code"
                                            :label="item.Name"
                                            :value="item.Code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-for="(res, index) in columnsSub('date')" :key="'res.data___' + index">
                        <div v-for="(btem,index) in hotSettings.data"
                            :key="'btem.Id__' + index"
                            :ref="res.data+btem[ListId]"
                            class="elementui-custom">
                            <el-form-item
                                    :prop="res.isVerify?('data.' + index + '.'+[res.data]):''"
                                    :rules="{required: true, validator: res.validator||undefined, trigger: 'change'}">
                                    <el-date-picker
                                        :placeholder="!res.isEdit?'':'请选择'"
                                        v-model="btem[res.data]"
                                        popper-class="el-input__prefix"
                                        type="date"
                                        :clearable="true"
                                        :disabled="!res.isEdit">
                                    </el-date-picker>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-for="(res, index) in columnsSub('radio')" :key="'res.data____' + index">
                        <div v-for="(btem,index) in hotSettings.data"
                            :key="'btem.Id__' + index"
                            :ref="res.data+btem[ListId]"
                            :disabled="!res.isEdit">
                            <label v-if="!res.isEdit">{{btem[res.data] === '1'? '是':'否'}}</label>
                            <el-form-item
                                    :prop="res.isVerify?('data.' + index + '.'+[res.data]):''"
                                    :rules="{required: true, validator: res.validator||undefined, trigger: 'change'}"
                                    v-if="res.isEdit">
                                <el-radio-group v-model="btem[res.data]" @change="radioChange($event,res,btem)">
                                    <el-radio v-for="(item,index) in res.items" :key="'radio_' + index" :label="item.value">
                                        {{item.label}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-for="(res, index) in columnsSub('status')" :key="'res.data_____' + index">
                        <div v-for="(btem,index) in hotSettings.data"
                            :key="'btem.Id__' + index"
                            :ref="res.data+btem[ListId]"
                            :disabled="!res.isEdit"
                            style="display:flex; justify-content:center;align-items:center">
                            <el-form-item
                                    :prop="res.isVerify?('data.' + index + '.'+[res.data]):''"
                                    :rules="{required: true, validator: res.validator||undefined, trigger: 'change'}">
                                <el-image v-if="res.moldType === 'img'" :src="btem[res.data] === 1 ?rightImgurl:errorImgurl" style="width: 15px; height: 15px">
                                </el-image>
                                <label v-if="res.moldType === 'text' && btem[res.data] === 1" style="color:green;">启用</label>
                                <label v-if="res.moldType === 'text' && btem[res.data] === 0" style="color:red;">未启用</label>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-for="(res, index) in columnsSub('img')" :key="'res.data______' + index">
                        <div v-for="(btem,index) in hotSettings.data"
                            :key="'btem.Id__' + index"
                            :ref="res.data+btem[ListId]"
                            :disabled="!res.isEdit"
                            style="display:flex; justify-content:center;align-items:center">
                            <el-form-item
                                    :prop="res.isVerify?('data.' + index + '.'+[res.data]):''"
                                    :rules="{required: true, validator: res.validator||undefined, trigger: 'change'}">
                                <!-- <el-image :src="btem[res.data]" style="width: 30px; height: 30px" :preview-src-list="imgPreviewList">
                                </el-image> -->
                                 <el-image :src="btem[res.data]" style="width: 30px; height: 30px" :preview-src-list="[btem[res.data]]">
                                </el-image>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-for="(res, index) in columnsSub('bili')" :key="'res.data_______' + index">
                        <div v-for="(btem,index) in hotSettings.data"
                            :key="'btem.Id__' + index"
                            :ref="res.data+btem[ListId]"
                            :disabled="!res.isEdit"
                            style="display:flex; justify-content:center;align-items:center">
                            <el-form-item
                                    :prop="res.isVerify?('data.' + index + '.'+[res.data]):''"
                                    :rules="{required: true, validator: res.validator||undefined, trigger: 'change'}">
                                    <span>{{btem[res.data]}} / {{btem[res.data2]}}</span>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-for="(res, index) in columnsSub('link')" :key="'res.data_________' + index">
                        <div v-for="(btem,index) in hotSettings.data"
                            :key="'btem.Id__' + index"
                            :ref="res.data+btem[ListId]"
                            :disabled="!res.isEdit"
                            style="display:flex; justify-content:center;
                            align-items:center;color:#2196f3;cursor:pointer">
                            <el-form-item
                                    :prop="res.isVerify?('data.' + index + '.'+[res.data]):''"
                                    :rules="{required: true, validator: res.validator||undefined, trigger: 'change'}">
                                    <span @click="linkClick($event,res,btem)">{{btem[res.data]}}</span>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="bz-table-drawer" v-if="true">
            <table-drawer
                :isAddDrawer="isAddDrawer"
                :formDrawerOpen="formDrawerOpen"
                :formDrawerSize="formDrawerSize"
                :formDrawerlabel="formDrawerlabel"
                :formDrawerRow="formDrawerRow"
                :formDrawerData="formDrawerData"
                @on-drawer-row-change="onDrawerRowChange"
                @on-drawer-close="onDrawerClose"
                @on-drawer-save="onDrawerSave"
                @buttons-emit="onButtonsEmit">
            </table-drawer>
        </div>
    </div>
</template>


<script lang="ts">
    import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
    import {Getter, Action, namespace, State} from 'vuex-class';
    import _ from 'lodash'
    import {traversingTree, listIsCheck} from '@/util';
    import {HotTable} from '@handsontable/vue';
    import Handsontable from 'handsontable';
    import {api} from "@/api";
    import axios from 'axios';

    @Component({
        name: 'TableList',
        components: {HotTable}
    })
    export default class TableList extends Vue {
        public $refs!: {
            search: HTMLFormElement,
            bzHot: HTMLFormElement,
            tableForm: HTMLFormElement,
            cascader: HTMLFormElement
        };

        rightImgurl:string = require("@/assets/images/right.png");
        errorImgurl:string = require("@/assets/images/error.png");
        warnImgurl:string = require("@/assets/images/warn.png");

        field: any = {};

        @State('ENUMS')
        ENUMS!: any;

        @State('ORG')
        ORG!: any;

        @State('POSITION')
        POSITION!: any;

       @Prop({
            type: Array,
            default: () => {
                return [];
            }
        })
        searchDevices!: any;

        @Prop({
            type: String,
            default: 'id'
        })
        ListId!: any;
        @Prop({
            type: Array,
            default: () => {
                return [];
            }
        })
        imgPreviewList!: any;
        //加载动画
        @Prop({
            type: Boolean,
            default: false
        })
        loading!: false;

        //页数规格
        @Prop({
            type: Number,
            default: 1
        })
        value!: number;

        //当前页数
        @Prop({
            type: Number,
            default: 0
        })
        pageNum!: number;

        //总数
        @Prop({
            type: Number,
            default: 0
        })
        total!: number;

        //过滤对象
        @Prop({
            type: Object,
            default: () => {
                return {};
            }
        })
        queryParams!: any;

        //是否隐藏分页
        @Prop({
            type: Boolean,
            default: false
        })
        hidePaging!: false;

        //是否显示编辑
        @Prop({
            type: Boolean,
            default: false
        })
        showEdit!: false;

        @Prop({
            type: Boolean,
            default: false
        })
        showExport!: false;

        @Prop({
            type: String,
            default: ''
        })
        savePushKey!: any;

        //列表配置项
        @Prop({
            type: Object,
            default: () => {
                return {};
            }
        })
        settings!: any;

        //搜索配置项
        @Prop({
            type: Array,
            default: () => {
                return []
            }
        })
        searchSetting!: any;

        //数据
        @Prop({
            type: Object,
            default: () => {
                return {};
            }
        })
        query!: any;

        //保存接口
        @Prop({
            type: String,
            default: ''
        })
        saveApi!: any;

        //保存key
        @Prop({
            type: Object,
            default: () => {
                return {};
            }
        })
        savekey!: any;

        //保存编辑抽屉规格
        @Prop({
            type: String,
            default: '360px'
        })
        formDrawerSize!: any;

        @Prop({
            type: String,
            default: '80px'
        })
        formDrawerlabel!: string;

        values: any = '';
        isEdit: boolean = false;
        pageSize: number = 10;
        current: number = 1;
        root: string = 'bz-hot';
        isCheckAll: boolean = false;
        hotSettings: any = {};
        cascaderList: any = {};
        contain: any = ['button', 'cascader'];
        editIds: any = [];
        isAddDrawer: boolean = false;
        formDrawerOpen: boolean = false;
        formDrawerRow: any = {};
        formDrawerData: any = {};

        //关闭抽屉
        onDrawerClose() {
            this.formDrawerOpen = false;
            this.isAddDrawer = false;
            this.formDrawerRow = {};
            this.formDrawerData = {};
        }

        //保存抽屉
        onDrawerSave() {
            this.onDrawerClose();
            this.$emit('on-drawer-save');
            this.$emit('on-search-click', this.selfPageNum)
        }

        //抽屉操作
        onDrawerRowChange(formItem: any, row: any, event: any) {
            this.$emit(row.emit, formItem, row, event);
        }
        // 抽屉按钮点击事件
        onButtonsEmit(emit:any, item:any) {
            this.$emit(emit,item);
        }

        columnsSub(type: string) {
            let ary: any = this.hotSettings.columns.filter((item: any) => {
                return item.mold === type;
            });
            return ary;
        }

        get selfPageNum() {
            return this.pageNum || this.current
        }

        set selfPageNum(data: number) {
            this.current = data;
        }

        @Watch('value', {
            deep: true,
            immediate: true,
        })
        watchValue(data: number) {
            this.pageSize = data
        }

         @Watch('settings.data', {
            deep: true
        })
        watchSettingsData(data: any) {
            this.resetData();
            this.hotSettings = Object.assign(this.hotSettings, this.createdSub());
        }

        @Watch('settings.hiddenColumns', {
            deep: true
        })
        watchSettingsHiddenColumns(data: any) {
            this.$set(this.hotSettings, 'hiddenColumns', data)
            this.$refs.bzHot.hotInstance.updateSettings({
                hiddenColumns: this.hotSettings.hiddenColumns
            });
        }

        pageSizeChange(pageSize: number) {
            this.pageSize = pageSize
            this.$emit('input', this.pageSize)
            this.changePageNum(this.selfPageNum)
        }

        //切页码
        async changePageNum(pageNum: number) {
            this.selfPageNum = pageNum;
            this.$emit('on-change', pageNum)
        }

        //回车
        async onEnter() {
            this.selfPageNum = 1;
            //点击搜索时重置当前页
            this.$emit('on-enter-click', 1)
        }

        //清空
        async onClear() {
            this.selfPageNum = 1
            //点击搜索时重置当前页
            this.$emit('on-clear-click', 1)
        }

        //编辑
        onEdit() {
            this.isEdit = true;
            this.switchEdit(this.isEdit);
        }

        onExport() {
            const exportPlugin = this.$refs.bzHot.hotInstance.getPlugin('exportFile');
            exportPlugin.downloadFile('csv', {
                bom: 'UTF-8', // 允许您使用BOM签名导出数据。
                columnDelimiter: ',', // 允许您定义列分隔符。
                columnHeaders: true, // 允许使用列标题导出数据。
                exportHiddenColumns: true, // 允许您从隐藏列导出数据。
                exportHiddenRows: true, // 允许您从隐藏行导出数据
                fileExtension: 'csv', // 允许您定义文件扩展名。
                filename: 'MyFile[YYYY]-[MM]-[DD]', // 允许您定义文件名。
                mimeType: 'text/csv', // 允许您定义MIME类型。
                rowDelimiter: '\r\n', // 允许您定义行分隔符。
                rowHeaders: true // 允许您使用行标题导出数据。
            });
        }

        //保存
        onSave() {
            this.$refs.tableForm.validate((valid: any) => {
                if (valid) {
                    let ary: any = this.hotSettings.data.filter((res: any) => _.includes(this.editIds, res[this.ListId]));
                    if (ary.length) {
                        let field: any = {};
                        if (this.savekey) {
                            field = this.savekey;
                        } else {
                            field = {
                                Id: '',
                                IdCardNum: ''
                            };
                            this.hotSettings.columns.map((res: any) => {
                                if (res.mold) {
                                    this.$set(field, res.data, '')
                                }
                            });
                        }
                        let bzAll: any = ary.map((res: any) => {
                            let obj: any = {};
                            _.forOwn(field, (item, key) => {
                                this.$set(obj, key, res[key])
                            });
                            return obj;
                        });
                        let pushObj = {};
                        this.$set(pushObj,this.savePushKey,bzAll);
                        api[this.saveApi]({
                            data: pushObj
                        })

                        this.$emit('on-search-click', this.selfPageNum)
                        this.$emit('on-save', ary);
                    } else {
                        this.isEdit = false;
                        this.switchEdit(this.isEdit);
                        this.editIds = [];
                        this.$refs.tableForm.resetFields();
                    }
                } else {
                    this.$notify.error('信息填写有误');
                    return false;
                }
            });
        }

        //查询
        onSearch() {
            this.selfPageNum = 1
            this.$emit('on-search-click', 1)
        }

        //重置
        onReset() {
            this.selfPageNum = 1;
            _.each(this.$refs.search.$children, (res: any) => {
                _.each(res.$children, (item: any) => {
                    //设置所有的v-model为'';
                    item.$emit('input', '')
                })
            });
            this.initSearch();
            this.$emit('on-reset');
        }

        async initSearch() {
            this.searchSetting.map((res: any) => {
                this.$set(this.field, res.key, res.initValue || undefined);
            });
        }


        //全选
        onCheckAll(data: boolean) {
            this.isCheckAll = data;
            if (this.hotSettings.data.length) {
                this.hotSettings.data.map((item: any) => {
                    this.$set(item, 'IsCheck', data);
                });
                this.$refs.bzHot.hotInstance.updateSettings({
                    data: this.hotSettings.data
                });
            }
        }

        upDateSetting() {
            this.$refs.bzHot.hotInstance.updateSettings({
                data: this.hotSettings.data
            });
        }

        //获取选中数据
        getCheckAll(key: string) {
            return listIsCheck(this.hotSettings.data, key);
        }

        // 打开侧边栏
        openDrawer(isAdd:boolean, row: any,item:any) {
            this.isAddDrawer = isAdd;
            this.formDrawerOpen = true;
            this.formDrawerRow = row;
            this.formDrawerData = item;
        }

        //按钮
        buttonChange(v: any, row: any, item: any) {
            if (row.setting) {
                this.openDrawer(false,row,item);
            }
            this.$emit(row.emit, item);
        }

        //input修改
        iptChange(v: any, row: any, item: any) {
            this.editAry(item)
        }

        //select选中
        selChange(v: any, row: any, item: any) {
            this.editAry(item)
        }

        radioChange(v: any, row: any, item: any) {
            this.editAry(item)
        }

        linkClick(v: any, row: any, item: any) {
            this.$emit('on-link-click', item);
        }

        //记录修改的数据
        editAry(data: any) {
            if (!_.includes(this.editIds, data[this.ListId])) {
                this.editIds.push(data[this.ListId])
            }
        }

        //编辑状态切换
        async switchEdit(type: boolean) {
            //@ts-ignore
            _.forEach(this.hotSettings.columns, (item: any) => {
                if (item.mold) {
                    this.$set(item, 'isEdit', type)
                    if (!_.includes(this.contain, item.mold)) {
                        this.$set(item, 'readOnly', !type)
                    }
                }
            })
            this.$refs.bzHot.hotInstance.updateSettings({
                columns: this.hotSettings.columns
            });
        }

        //生成自定义组件
        createdSub() {
            let ary: any = _.cloneDeep(this.settings);
            let opAry: any = ary.columns.filter((item: any) => item.mold);
            if (opAry.length) {
                opAry.map((itemRow: any) => {
                    _.includes(this.contain, itemRow.mold) ? itemRow.readOnly = true : '';
                    itemRow.columnSorting = {
                        headerAction: false
                    };
                    itemRow.renderer = (instance: any, td: any, row: any, col: any, prop: any, value: any, cellProperties: any) => {
                        Handsontable.dom.empty(td); // 渲染前先清空元素
                        let name: any = prop + this.hotSettings.data[row][this.ListId];
                        // @ts-ignore
                        td.appendChild(this.$refs[name][0]);
                        return td;
                    }
                })
            }
            return ary;
        }

        //生成操作按钮
        createdOp() {
            let opAry: any = this.settings.columns.filter((item: any) => item.mold === 'op');
            if (opAry.length) {
                opAry.map((itemRow: any) => {
                    itemRow.readOnly = true;
                    itemRow.columnSorting = {
                        headerAction: false
                    };
                    itemRow.renderer = (instance: any, td: any, row: any, col: any, prop: any, value: any, cellProperties: any) => { // 自定义渲染单元格
                        Handsontable.dom.empty(td); // 渲染前先清空元素
                        let div: any = document.createElement('div');
                        div.style.textAlign = 'center';
                        itemRow.items.map((item: any) => {
                            let btn: any = document.createElement('button');
                            btn.className = 'el-button bz-tb-search-btn el-button--' + item.type + ' el-button--mini';
                            btn.setAttribute('type', 'button');
                            btn.insertAdjacentHTML('afterbegin', item.name);
                            btn.onclick = () => {
                                this.$emit(item.emit, this.hotSettings.data[row]);
                            };
                            div.appendChild(btn);
                        });
                        td.appendChild(div);
                        return td;
                    };
                })
            }
        }

        //重置状态
        resetData() {
            this.isEdit = false;
            this.isCheckAll = false;
            this.editIds = [];
            this.$refs.tableForm.resetFields();
        }

        async created() {
            let that = this;
            that.hotSettings = {
                licenseKey: 'non-commercial-and-evaluation',
                width: '100%',
                height: 'auto',
                autoColumnSize: true, //自适应列大小
                stretchH: 'all',//根据宽度横向扩展，last:只扩展最后一列，all: 每列扩展，  none：默认不扩展
                colHeaders: (index: any, row: any) => {
                    let column = that.hotSettings.columns[index];
                    if (column.type === 'checkbox') {
                        let html: any = `<div data-type="checkAll" style="cursor: pointer"><input type="checkbox" style="pointer-events: none;"/></div>`;
                        let htmlAll: any = `<div data-type="checkAll" style="cursor: pointer"><input type="checkbox" checked style="pointer-events: none;"/></div>`
                        return that.isCheckAll ? htmlAll : html;
                    } else {
                        return column.name;
                    }
                },
                afterOnCellMouseDown: (event: any, coords: any, TD: any) => {
                    if (coords.row === -1 && coords.col === 0 && event.target.attributes['data-type']) {
                        that.onCheckAll(!event.target.childNodes[0].checked);
                    }
                },
                rowHeaders: true,  //自定义行表头
                headerTooltips: true, //表头提示
                autoWrapRow: true, //自动换行
                data: [], //数据可以是二维数组，也可以是数组对象
                columns: [],     //添加每一列的数据类型和一些配置
                className: "htCenter",
                afterChange: (changes: any, source: string) => { //数据改变时触发此方法
                },
                beforeChange: (changes: any, source: string) => { //开始改变单元格前被调用
                },
                contextMenu: {
                    items: {
                        "copy": {
                            name: '复制',
                        }
                    }
                },//右键菜单
                manualColumnResize: true,//手工更改列距
                // cells: function (row:any, col:any, prop:any) {
                //     console.log(row,col,prop)
                //     let cellProperties:any = {}
                //
                //     if (row === 0 && col === 0) {
                //         cellProperties.readOnly = true;
                //     }
                //
                //     return cellProperties;
                // }
                //fillHandle: 'vertical', //选中拖拽复制 possible values: true, false, "horizontal", "vertical"
                // cell: [
                //     {row:0, col:0, className: 'htCenter'}, // 右对齐垂直居中，只读
                // ]
                //currentRowClassName: 'currentRow', //为选中行添加类名，可以更改样式
                //currentColClassName: 'currentCol',//为选中列添加类名
                //fixedColumnsLeft: 0,//固定左边列数
                //fixedRowsTop: 0,//固定上边列数
                //mergeCells: [   //合并
                //    {row: 1, col: 1, rowspan: 3, colspan: 3},  //指定合并，从（1,1）开始行3列3合并成一格
                //    {row: 3, col: 4, rowspan: 2, colspan: 2}
                //],
                // manualColumnFreeze: true, //手动固定列
                // manualColumnMove: true, //手动移动列
                // manualRowMove: true,   //手动移动行
                // manualRowResize: true,//手动更改行距
                //comments: true, //添加注释
                //customBorders:[],//添加边框
            };
        }
    }
</script>

<style scoped lang="scss">
    .bz-tb-search-wrapper ::v-deep   input::-webkit-outer-spin-button,
    .bz-tb-search-wrapper ::v-deep   input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    .bz-tb-search-wrapper ::v-deep   input[type="number"]{
        -moz-appearance: textfield;
    }
     .bz-table {
        .bz-tb-search {
            font-size: 12px;
        }

        .bz-tb-title {
            min-height: 36px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 10px 0;

            .bz-tb-title-left {
                font-size: 14px;
                display: flex;

                ::v-deep .l-t {
                    font-size: 16px;
                    font-weight: bold;
                }
            }

            .bz-tb-title-right {
                display: flex;
                justify-content: center;
                align-items: center;

                .bz-tb-title-right-selAll {
                        position: relative;
                        top: 1px;

                        ::v-deep .bz-tb-title-right-selAll-checkbox {
                            width: 28px;

                            &:hover {
                                i {
                                    transition: 0.3s ease-in-out;
                                    color: $primary;
                                }
                            }

                            &.is-checked {
                                .bz-tb-title-right-sel {
                                    color: $white;
                                }
                            }

                            .el-checkbox__inner {
                                width: 28px;
                                height: 28px;
                                transition: 0.3s ease-in-out;

                                &::after {
                                    display: none;
                                }
                            }
                        }

                        .bz-tb-title-right-sel {
                            width: 28px;
                            height: 28px;
                            line-height: 28px;
                            text-align: center;
                            position: absolute;
                            top: 0;
                            left: -1px;
                            font-size: 20px;
                            color: $primary;
                            z-index: 999;
                            pointer-events: none;
                            display: block;

                            i {
                                color: #DCDFE6;
                            }
                        }
                    }


                .bz-tb-edit-btn {
                    height: 29px;
                    margin-left: 10px;
                }
            }
        }

        .bz-tb-elForm {
            ::v-deep .el-form-item {
                margin-bottom: 0 !important;

                .el-form-item__error {
                    display: none;
                }

                &.is-error {
                    .el-input__inner {
                        border-color: #F56C6C !important;
                    }
                }
            }
        }

        .bz-tb-wrapper {
            .bz-tb-list {
                ::v-deep .handsontable[root='bz-hot'] {
                    font-size: 14px;

                    td {
                        border-color: $table-bd;
                        vertical-align: middle;
                        position: relative;

                        .bz-tb-custom-btem {
                            width: calc(100% + 8px);
                            margin-left: -4px;

                            .el-input__inner {
                                background-color: rgba($bg-primary, .5);
                            }
                        }

                        .bz-tb-custom-btem:not(:last-child) {
                            margin-right: 5px;
                        }
                    }

                    > .ht_master {
                        .wtSpreader {
                            th {
                                height: 35px !important;
                            }
                            tr {
                                &:hover {
                                    td {
                                        background-color: rgba(0, 94, 255, .1);
                                        .el-input__inner {
                                            background-color: transparent;
                                        }
                                    }
                                }
                            }
                        }

                        // .wtHolder {
                        //     width: 100% !important;
                        // }

                        // .wtHider {
                        //     width: 100% !important;
                        // }
                    }

                    > .ht_clone_top, > .ht_clone_top_left_corner, > .ht_clone_left {
                        th {
                            background-color: $table-bg;
                            border-color: $table-bd;

                            .relative {
                                padding: 6px 10px;
                            }
                        }
                    }

                    .handsontableInput {
                        line-height: 34px;
                        font-size: 12px !important;
                        padding-left: 6px;
                    }

                    .htCheckboxRendererInput {
                        margin: 0;
                    }

                    .htDimmed {
                        color: initial;

                        .htAutocompleteArrow {
                            display: none;
                        }
                    }

                    // .wtBorder {
                    //     &.corner {
                    //         border-width: 0 !important;
                    //     }
                    // }
                }

                ::v-deep {
                    .el-input {
                        &.is-disabled {
                            .el-input__inner {
                                cursor: text;
                                background-color: transparent !important;
                                border-color: transparent;
                                color: #000;
                                padding-left: 4px;
                                padding-right: 4px;

                            }

                            .el-input__suffix, .el-input__prefix {
                                    display: none;
                            }
                        }

                        .el-input__inner {
                            box-sizing: border-box;
                            height: 35px;
                            line-height: 35px;
                            border-radius: 0;
                            border-color: transparent;
                        }

                        .el-input__inner[readonly='readonly'] {
                            &::placeholder {
                                color: transparent;
                            }

                            & + .el-input__prefix {
                                display: none;
                            }
                        }
                    }

                    .el-select {
                        width: 100%;

                        .el-input__inner {
                            box-sizing: border-box;
                            padding-left: 15px;
                            &[disabled=disabled] {
                                background-color: transparent !important;
                                &::placeholder {
                                    color: transparent !important;
                                }
                            }

                            &::placeholder {
                                color: $grey-light !important;
                            }

                            & + .el-input__prefix {
                                display: none;
                            }
                        }
                    }

                }

                .bz-tb-custom-button{
                    display: flex;
                    flex: 1;
                    align-items: center;
                    justify-content: center;
                    flex-direction: row;
                    .el-form-item{
                        &:not(:last-child){
                            margin-right: 10px;
                        }
                    }
                }

                .noData {
                    width: 100%;
                    height: 36px;
                    font-size: 14px;
                    color: $grey;
                    border: 1px solid $table-bd;
                    border-top: 0 none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            .bz-tb-pagination {
                text-align: right;
                padding-top: 50px;

                ::v-deep .el-pagination__total {
                    float: left;
                }
            }
        }

        .bz-tb-custom {
            width: 0;
            height: 0;
            display: none;
        }
        .elementui-custom {
               .el-select  {
                    width:145px!important;
               }
               .el-input{
                    width:166px!important;
                    margin-left: 4px;
                    height:32px;
                }
                .el-input__inner{
                    width:166px!important;
                    margin-left: 4px;
                    height:32px;
                }
                .el-input--suffix .el-input__inner{
                    width:166px!important;
                    margin-left: 4px;
                    height:32px;
                }
                .el-input__icon{
                 height:116%;
                }
            }
    }


</style>
