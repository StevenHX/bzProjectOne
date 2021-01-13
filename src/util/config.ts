/**
 * Created by zhangbin on 2020/5/27.
 * 存储配置项
 */

interface setting {
    //是否区分内外网
    isDiff?: boolean,
    //是否开启产品期限验证
    isVerify?: boolean
}

//配置项
interface option {
    //应用编码
    appCode: string,
    //sso登录地址
    ssoLoginUrl: string,
    //sso后台地址,通常用于注销
    ssoServiceUrl: string,
    //系统path(context),用于保存cookie时的标记(用于修复去除地址栏#时登录ticket存储地址问题)
    sysPath?: string
}

interface options {
    config: option,
    //公网配置
    pubConfig?: option,
    setting?: setting
}

const options: options = {
    //默认或内网配置
    config: {
        appCode: '',
        //sso登录地址
        ssoLoginUrl: '',
        //sso后台地址,通常用于注销
        ssoServiceUrl: '',
        //系统path(context),用于保存cookie时的标记(用于修复去除地址栏#时登录ticket存储地址问题)
        sysPath: ''
    },
    setting: {
        //是否区分内外网即外网配置项存在时会区分内外网跳转,手动配置为false时公网配置无效
        isDiff: true,
        isVerify: true
    }

};

//标识是否初始化过配置项
let isInit = false;

/**
 * 设置配置项
 * @param s 插件选项
 * @param config 默认或内网配置
 * @param pubConfig 公网配置
 */
const setting = function (config: option, pubConfig?: option, s?: setting) {
    Object.assign(options.setting, s || {});
    if (config) {
        isInit = true;
        Object.assign(options.config, config || {});
    }
    if (pubConfig) {
        //todo 修复公网属性为空时覆盖的问题 待优化
        // @ts-ignore
        for (let prop in pubConfig) {
            // @ts-ignore
            if (!pubConfig[prop]) {
                // @ts-ignore
                delete pubConfig[prop];
            }
        }
        Object.assign(options.pubConfig || {}, pubConfig || {});
    }
};

/**
 * 获取设置项
 * @return {options.setting|{isDiff}}
 */
const getSetting = function (): setting {
    return options.setting || {};
};

/**
 * 返回判断内外网配置的配置项
 */
const getConfig = function () {
    return options.config;
};

export {
    getConfig,
    getSetting,
    setting,
    option
}
