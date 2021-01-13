/**
 * Created by zhangbin on 2020/5/27.
 * 令牌工具
 */
import * as cookie from 'tiny-cookie'
import {getConfig} from './config';

if (!cookie.isEnabled()) {
    console.error('浏览器居然还不支持cookie!部分功能可能出现意料之外的错误ヾ(｡ꏿ﹏ꏿ)ﾉﾞ');
}
let key = 'ticket';

/**
 * 设置和获取ticket
 * @param ticket
 * @return {string}
 */
const setTicket = function (ticket?:string):any {
    if (arguments.length === 0) {
        return cookie.get(key)||'';
    } else {
        // @ts-ignore
        cookie.set(key, ticket, {path: getConfig().sysPath});
    }
};

const getTicket = function () {
    return cookie.get(key)||'';
}

/**
 * 清除ticket
 */
const clearTicket = function () {
    cookie.remove(key,{path: getConfig().sysPath});
};

/**
 * 设置保存令牌的key名
 * @param k
 */
const setKey = function (k:string) {
    key = k;
};

/**
 * 获取令牌的key名
 * @return {string}
 */
const getKey = function ():string {
    return key;
};

export {
    setTicket,
    getTicket,
    clearTicket,
    setKey,
    getKey
}
