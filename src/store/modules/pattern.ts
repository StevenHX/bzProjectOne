/**
 * Created by zhangbin on 2020/5/27.
 * 公用正则表达式
 */
import {VuexModule, Module} from 'vuex-module-decorators';

@Module({name: 'pattern', namespaced: true})
class VuexStore extends VuexModule {
    //金额正则验证
    public money = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/
    //手机号
    public telephone = /(^[1][0-9][0-9]{9}$)/
}

export default VuexStore
