import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';
import "./scss/base.scss";
import 'handsontable/dist/handsontable.full.css';

import { sync } from 'vuex-router-sync'
import _ from 'lodash';

import ViewAnim from "@/components/ViewAnim.vue";
import RouterViewAnim from "@/components/RouterViewAnim.vue";
import TableList from "@/components/TableList/TableList.vue";
import LMenu from '@/components/LMenu.vue';

Vue.component('ViewAnim', ViewAnim);
Vue.component('RouterViewAnim', RouterViewAnim);
Vue.component('TableList', TableList);
Vue.component('LMenu', LMenu);

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

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
