import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';
import "./scss/base.scss";
import 'handsontable/dist/handsontable.full.css';

import { sync } from 'vuex-router-sync'
import _ from 'lodash';
import utilMixin from './util/utilMixin';

import InsetBack from "@/components/InsetBack.vue";
import ViewAnim from "@/components/ViewAnim.vue";
import RouterViewAnim from "@/components/RouterViewAnim.vue";
import TableList from "@/components/TableList/TableList.vue";
import Open from '@/components/Open.vue';
import LMenu from '@/components/LMenu.vue';
import TableDrawer from "@/components/TableList/TableDrawer.vue";
import TreeDrawer from "@/components/TableList/TreeDrawer.vue";

Vue.component('InsetBack', InsetBack);
Vue.component('ViewAnim', ViewAnim);
Vue.component('RouterViewAnim', RouterViewAnim);
Vue.component('TableList', TableList);
Vue.component('Open', Open);
Vue.component('LMenu', LMenu);
Vue.component('TableDrawer', TableDrawer);
Vue.component('TreeDrawer', TreeDrawer);

// 同步路由状态到vuex中管理
sync(store, router);

Vue.config.productionTip = false;

//开启测试环境调试工具
if (process.env && process.env.VUE_APP_DEV_TOOLS === 'true') {
    Vue.config.devtools = true;
}

//全局lodash
Vue.prototype._ = _;

//根路径 用于当前项目不是部署在根路径时
Vue.prototype.$baseUrl = process.env.BASE_URL;

//全局工具函数
Vue.use(utilMixin);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
