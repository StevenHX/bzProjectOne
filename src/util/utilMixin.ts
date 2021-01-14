/**
 * 工具和常用常量混入
 */
import Vue from "vue";
import {mapGetters} from 'vuex'
import {findComponentUpward, traversingTree} from '@/util'
import store from "@/store";
import m from 'moment'

const install = function (Vue: Vue.VueConstructor) {
    const options: any = {
        data() {
            return {}
        },
        computed: {
            ...mapGetters(['getBreadcrumbs'])
        },
        methods: {
            $backPage() {
                let that: any = this;
                //todo 暂定返回前一路由
                //todo 一级路由时统一返回到首页
                that.$router.back()
            },
            //日期转换
            $DATE(value: any, format: string = 'YYYY-MM-DD') {
                return value?m(value).format(format):'';
            },
            //枚举类
            $ENUMS(t:string,v: any) {
                let s = store.state.ENUMS[t].find((res:any)=> res.Code===v);
                return s?s.Name:v;
            },
            //组织转换
            $ORG(value: any) {
                let tx: string = '';
                traversingTree(store.state.ORG, {
                    childList: 'Children',
                    filterFun: (item: any) => {
                        if (item.Code === value) {
                            tx = item.Name;
                        }
                    }
                });
                return tx;
            },
            //职位转换
            $POSITION(v: any) {
                let s = store.state.POSITION.find((res:any)=> res.Code===v);
                return s?s.Name:v;
            },
            //岗位转换
            $POST(v: any) {
                let s = store.state.POST.find((res:any)=> res.Code===v);
                return s?s.Name:v;
            }
        }
    }
    //公用工具函数
    Vue.mixin(options);
};

const exp = {
    install: install
};
export default exp;
