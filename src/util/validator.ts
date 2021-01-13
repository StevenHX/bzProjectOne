/**表单验证
 * Created by zhangbin on 2020/7/10.
 */

const rules = {
    telephone: /^1[0-9]{10,10}$/
};

const v_telephone = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('请输入手机号码'));
    } else {
        let reg = rules.telephone;
        if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号码'));
        } else {
            callback();
        }
    }
};

export {
    v_telephone
}
