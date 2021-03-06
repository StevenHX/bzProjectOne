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

}

const store = new Vuex.Store(Object.assign({
        strict: process.env.NODE_ENV !== 'production'
    },
    VuexStore, {
        modules: {pattern}
    }));

Vue.prototype.$store = store;
export default store
