import Vue from 'vue'
import Vuex from 'vuex'
import {VuexModule, Module, Mutation, Action} from 'vuex-module-decorators';
import { getStorage, setStorage,clearStorage} from "@/util/utils";
import _ from 'lodash';
import {api} from '@/api'

//模块
import pattern from './modules/pattern'

Vue.use(Vuex)

@Module
class VuexStore extends VuexModule {
    public CACHVIEWS: any[] = [];
    public BREADCRUMBS: any[] = [];
    //@ts-ignore
    public LOGIN_INFO: sys.loginInfo = {};
    //系统枚举值
    public ENUMS: any[] = [];
    public ORG: any[] = [];

    public get getBreadcrumbs() {
        return this.BREADCRUMBS;
    }

    get objBreadcrumbs() {
        let res: any = {};
        _.each(this.BREADCRUMBS, (item: any) => {
            res[item.path] = item;
        });
        return res;
    }

    public get getCachViews() {
        return this.CACHVIEWS;
    }

    @Mutation
    public setBreadcrumbs(info: any[]) {
        try {
            let temp: any = [];
            info.forEach((item: any) => {
                //优先使用已经存在的名称,最后一项始终使用最新的名称,修复切换时名称是旧的问题
                if (this.objBreadcrumbs[item.path] && !item.query) {
                    temp.push(this.objBreadcrumbs[item.path])
                } else {
                    temp.push({
                        name: item.name,
                        path: item.path,
                        query: item.query
                    })
                }
            });
            setStorage('bread',temp);
            this.BREADCRUMBS = temp;
        } catch (e) {
            clearStorage('bread')
            this.BREADCRUMBS = [];
        }
    }

    @Mutation
    public setCachViews(info: any = []) {
        this.CACHVIEWS  = info;
    }

    @Mutation
    public setLoginInfo(info: any = {}) {
        this.LOGIN_INFO = info;
        //todo 判断特殊身份权限标记
    }

    @Mutation
    setEnums(info: any) {//更新枚举信息
        this.ENUMS = info;
    }

    @Mutation
    setOrg(info: any) {
        this.ORG = info;
    }

    @Action({rawError: true})
    public async syncEnum() {
        let data = (await api.Dictionary_GetDictJson()).Data;
        this.context.commit('setEnums', data)
    }

    @Action({rawError: true})
    public async syncOrg() {
        let data = (await api.Dictionary_GetAll());
        this.context.commit('setOrg', data)
    }

    @Action({rawError: true})
    public async syncLoginInfo() {
        let data = (await api.Session_GetUserConfigurations('Attendances'));
        this.context.commit('setLoginInfo', data)
    }
}

const store = new Vuex.Store(Object.assign({
        strict: process.env.NODE_ENV !== 'production'
    },
    VuexStore, {
        modules: {pattern}
    }));

Vue.prototype.$store = store;
export default store
