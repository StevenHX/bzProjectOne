import NProgress from 'nprogress'
import 'nprogress/nprogress.css';

import {Message, Loading, Notification} from 'element-ui'
import store from '@/store'
import router from '@/router'

import {AxiosResponse, AxiosInstance} from 'axios'
import { getStorage } from "@/util/utils";

const setInterceptors = (instance: AxiosInstance) => {
    if (!instance) {
        return;
    }
    // 添加请求拦截器
    instance.interceptors.request.use((config) => {
        //设置统一令牌
        let token = getStorage('token') || "";
        config.headers.common['Authorization'] = "Bearer " + token;
        config.headers['Content-Type'] !== 'application/json';

        // 在发送请求之前做些什么
        if (!config.load) {
            config.load = {}
        }
        if (!config.load.noLoading) {
            NProgress.start();
        }
        return config;
    }, function (error) {
        hideLoad(error);
        // 对请求错误做些什么
        return Promise.reject(error);
    });


    // 添加响应拦截器
    instance.interceptors.response.use(function (response: any) {
        // 对响应数据做点什么
        hideLoad(response);

        let data = response.data || {};
        return new Promise(function (resolve, reject) {
            responseCallBack(response, data, resolve, reject)
        });
    }, function (error: any) {
        hideLoad(error);
        let data = error.data || {};
        //不做处理
        if (!error.config || !error.config.notProcessed) {
            // 对响应错误做点什么
            Message.error({
                showClose: true,
                message: '服务异常',
                type: 'error'
            });
        }
        if (error && error.response) {
            if (error.response.status == 401) {
                router.replace({ path: '/login'});
            }
        }

        return Promise.reject(error);
    });

    //正常响应回调
    async function responseCallBack(response: AxiosResponse, data: any, resolve: Function, reject: Function) {
        // 判断如果是主系统或请求人事系统
        if (data.CurrentLanguageName || (data[0] && data[0].AllParentCode)) {
            resolve(data);
        } else {
            if (data.code) {
                if (data.code === 10200) {
                    resolve(data);
                } else {
                    Notification.error(data.message);
                    reject(data)
                }
            } else {
                Notification.error('操作失败');
                reject(data)
            }
        }
    }
}

let hideLoad = (response: any) => {
    NProgress.done();
};

export {
    setInterceptors
}
