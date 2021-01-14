import Vue from 'vue'
import VueRouter from 'vue-router'
import {getComponentByRootPath} from './util'
import attenDanceManage from './attendanceManager'

Vue.use(VueRouter)
//开发环境下不使用按需加载打包模式,提升打包速度
let getComponent = getComponentByRootPath('');

const appRoutes: any = {
    path: '/',
    name: '首页',
    component: getComponent('Layout/Main'),
    children: [
        ...attenDanceManage
    ]
};

const login = {
    path: '/login',
    name: '登录',
    component: getComponent('Login/Login')
}

//未定义路由跳转404
const notFindPage = {
    path: '*',
    name: '找不到页面',
    component: getComponent('NotFind/NotFind')
};

const router = new VueRouter({
    mode: 'history',
    routes: [
        login,
        appRoutes,
        notFindPage,
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return {
            x: 0,
            y: 0
          }
        }
    }
});
router.beforeEach((to: any, from: any, next: any) => {
    try {
        //保存路由配置,用于面包屑点击返回,刷新时from的path是'/'
        if (to.matched.length && from.path !== '/') {
            let temp: any = [...to.matched];
            temp[temp.length - 1].query = to.query;
            temp[temp.length - 1].name = to.query.$pageName || to.name;
            Vue.prototype.$store.commit('setBreadcrumbs', temp)
        }
    } catch (e) {
        console.error(e)
    }
    next()
});
export {
    appRoutes
}
export default router
