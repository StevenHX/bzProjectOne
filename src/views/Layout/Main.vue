<template>
    <el-container id="container" :class="{'bz-aside-iscollapse':isCollapse}">
        <el-header>
            <div class="bz-aside-util">
                <div class="bz-logo">{{appName}}</div>
            </div>
            <div class="bz-aside-collapse" @click="onCollapse" :title="isCollapse?'展开':'收起'">
                <i :class="['bz-aside-icon',isCollapse?'el-icon-s-unfold':'el-icon-s-fold']"></i>
            </div>
            <div class="bz-user" v-if="loginInfo">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <el-avatar  icon="el-icon-user-solid"></el-avatar>
                            {{loginInfo.Name}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>{{loginInfo.CompanyName}}</el-dropdown-item>
                            <el-dropdown-item command="quit">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
        </el-header>
        <el-container>
            <el-aside class="scrollBar">
                <el-menu :collapse="isCollapse"
                         :collapse-transition="false"
                         :default-active="activeMenu"
                         class="el-menu-vertical-demo"
                         @select="handleSelect">
                    <l-menu :left-menu="leftMenu" :isCollapse="isCollapse" @toPage="toPage"></l-menu>
                </el-menu>
            </el-aside>
            <el-container class="bz-container">
                <el-main ref="main" class="scrollBar-warp">
                    <div class="breadcrumb-wrapper">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item v-for="(item,index) in breadcrumbs"
                                                :key="index"
                                                class="no-to"
                                                :to="delName(item)">{{item.name}}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div class="bz-main" v-if="CurrentLanguageName">
                        <keep-alive>
                            <router-view-anim v-if="$route.meta.keepAlive"></router-view-anim>
                        </keep-alive>
                        <router-view-anim v-if="!$route.meta.keepAlive"></router-view-anim>
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <template>
            <el-backtop target=".scrollBar-warp"></el-backtop>
        </template>
    </el-container>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {State, Getter, Action, Mutation, namespace} from 'vuex-class';
    import _ from 'lodash';
    import {Container} from 'element-ui';
    import {setTicket} from '@/util/ticket'
    import {api} from '@/api';
    import {appRoutes} from '@/router';
    import { getStorage, setStorage} from "@/util/utils";

    @Component({
        name: 'Layout',
        components: {}
    })
    export default class Layout extends Vue {
        appName:string = 'iMESX8云监控平台'
        public $refs!: {
            main: Container
        };
        loginInfo:any = '';

        @Getter('getBreadcrumbs')
        getBreadcrumbs: any;

        @Watch('$route', {
            immediate: true
        })
        routeChange(to: any, from: any) {
            if (to.meta.isMenu) {
                this.activeMenu = to.path;
            } else {
                this.activeMenu = to.meta.parentsPath;
            }
        }

        loading: any = '';
        isCollapse: boolean = false;
        leftMenu: any = [];
        activeMenu: any = '';
        CurrentLanguageName: any = '';

        //面包屑
        get breadcrumbs() {//item.path?'can-to':'no-to'
            if (!this.$route.matched.length) {
                return [];
            }

            let res: any = [];
            let tempList = [...this.$route.matched];
            let breadcrumb = this.getBreadcrumbs;
            if (breadcrumb.length) {
                tempList = [...breadcrumb];
            }

            //删除主页
            _.remove(tempList, (item) => {
                return item.path === '/main';
            });
            _.each(tempList, (item: any) => {
                res.push({
                    name: item.name,
                    //一层路由时没有path
                    path: (item.path.split('/').length <= 2) || item.meta.isExpand ? '' : item.path,
                    query: item.query
                })
            });

            return res;
        }

        //面包屑清除
        delName(itemData: any) {
            let res = {...itemData};
            delete res.name;
            return res;
        }

        //点击左侧菜单
        handleSelect(index: any, indexPath: any) {
            this.activeMenu = index;
        }

        //收缩菜单
        onCollapse() {
            this.isCollapse = !this.isCollapse;
        }

        //路由跳转
        toPage(path: string) {
            if (path === this.$route.path) {
                return
            }
            this.$router.push({
                path: path
            }).catch((e) => {
                console.error(e)
            })
        }

        async manageRoleAuth() {
            this.$router.addRoutes([]);
            let leftAry = _.cloneDeep(this.leftMenu[0].children);
            let needAry: any[] = [];
            let grantedPermissions = [];// todo
            leftAry.forEach(function(item:any) {
                if (item.meta.needAuth) {
                    // todo
                } else {
                    needAry.push(item);
                }
            });
            this.leftMenu[0].children = needAry;
            this.$router.addRoutes(this.leftMenu);
        }

        async handleCommand(commond:any) {
            if (commond === 'quit') {
                setStorage('token','');
                setStorage('loginInfo','');
                this.$router.replace({ path: '/login'});
            }
        }

        async login() {
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            let token =this.$route.query.token;
            if(token){
                setStorage('token',token);
            }
            if(! getStorage('token')) {
                this.$router.push({ path: '/login'});
            }
        }

        async mounted() {
            await this.login();
            this.leftMenu = appRoutes.children;
            await this.manageRoleAuth();
            this.loginInfo = getStorage('loginInfo');
            this.CurrentLanguageName = 1;
            this.loading.close();
            if(getStorage('token')) {
                this.$router.push({ path: this.leftMenu[0].children[0].path });
            }
        }
    }
</script>
<style scoped lang="scss">
    #container {
        height: 100%;
        overflow: hidden;

        //收起状态的操作栏
        &.bz-aside-iscollapse {
            ::v-deep .bz-menu {
                .el-submenu__title {
                    span {
                        display: none;
                    }
                }
            }

            .bz-container {
                width: calc(100% - 64px) !important;
                left: 64px !important;
            }
        }

        //头部
        .el-header {
                @include gradient-color-tb(#224157, #40566b);
                box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);
                color: #FFFFFF;
                display: flex;
                align-items: center;
                z-index: 10;
                // justify-content: space-between;


            .bz-aside-util {
                width: 180px;
                font-size: 20px;

                .bz-logo {
                    // text-shadow: 1px 2px 1px rgba(#fff, .3);
                    color: $white;
                    font-weight: bold;
                }
            }

            .bz-aside-collapse {
                cursor: pointer;

                .bz-aside-icon {
                    color: $white;
                    font-size: 20px;

                    &:hover {
                        color: $grey-darker;
                    }
                }
            }

            .bz-user {
                    display: flex;
                    flex: 1;
                    justify-content: flex-end;
                    .el-dropdown {
                        &:not(:last-child) {
                            margin-right: 20px;
                        }

                        .el-dropdown-link {
                            width: 100px;
                            margin-left: 10px;
                            color: $white;
                            cursor: pointer;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-around;
                            align-items: center;
                        }
                    }
            }
        }

        .el-container {
            position: relative;

            &::before {
                content: '';
                width: 1px;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: $white;
            }

            //侧栏
            .el-aside {
                height: 100%;
                background-color: #f5f5f5;
                border-right: 1px solid $bd;
                position: absolute;
                top: 0;
                left: 0;

                .el-menu {
                    background-color: transparent;
                }

                &:not(.el-menu--collapse) {
                    width: auto !important;
                }

                .el-menu-vertical-demo {
                    min-height: 100% !important;
                    border-right: none;

                    &:not(.el-menu--collapse) {
                        width: 200px;
                        min-height: 400px;
                    }
                }
            }

            //主体
            .bz-container {
                width: calc(100% - 200px);
                height: 100%;
                position: absolute;
                top: 0;
                left: 200px;

                ::v-deep .el-main {
                    background-color: $white;
                    overflow-y: overlay;
                    position: relative;
                    //面包屑
                    .breadcrumb-wrapper {
                        width: 100%;
                        padding: 20px 20px 15px 20px;
                        border-bottom: 1px solid #EEEEEE;
                        position: absolute;
                        top: 0;
                        left: 0;

                        .no-to {
                            pointer-events: none;
                        }
                    }

                    //页面
                    .bz-main {
                        width: 100%;
                        height: calc(100% - 50px);
                        margin-top: 50px;
                    }
                }
            }

        }
    }

    //滚动条
    .scrollBar-warp {
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

</style>
