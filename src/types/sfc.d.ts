interface Window {
    //允许任意属性存在
    [propName: string]: any
}

//不支持ts的模块(也可以手动设定类型)
declare module 'vue-virtual-scroller'
declare module 'vue-json-viewer'
declare module 'leancloud-realtime-plugin-typed-messages'
declare module 'animated-number-vue'

//覆盖某类型
declare type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

//定义系统业务数据模型
declare namespace sys{
    type loginInfo = {
        CurrentLanguageName: string
        CurrentUserLoginInfo: {
            CustomerCode: any
            CustomerName: any
            FactoryCode: any
            FactoryName: any
            NickName: string
            UserId: number
            UserName: string
        }
        GrantedPermissions: any
    }
}
