import {Vue} from 'vue-property-decorator';
import _ from 'lodash';
import axios from 'axios';
type options = {
    //树结构的子节点名称
    childList?: string,
    beforeFun?: Function,
    filterFun?: Function,
    afterFun?: Function
}
/**
 * 操作树结构数据
 * @param list
 * @param options
 * @param parent
 */
const traversingTree = function (list: any[], options?: options, parent?: any): void {
    if (!list) {
        return
    }
    let childList = options && options.childList ? options.childList : 'childList';
    if (!options) {
        options = {}
    }
    if (options.beforeFun) {
        options.beforeFun(list, parent);
    }
    for (let [index, item] of list.entries()) {
        let flag = true;
        if (options.filterFun) {
            flag = options.filterFun(item, index, list, parent);
        }
        if (item[childList] && flag !== false) {
            traversingTree(item[childList], options, item);
        }
    }
    if (options.afterFun) {
        options.afterFun(list, parent);
    }
};

/**
 * 转换枚举
 * @param obj 要转换的对象
 */
const overwriteEnum = function (obj: any): any {
    let res: any = {};
    for (let key of Object.keys(obj || {})) {
        let item = obj[key];
        if (item && item.disName && item.ordinal !== undefined) {
            res[key] = item.name;
        } else {
            res[key] = item;
        }
    }
    return res;
};

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
const isObject = function (value: any) {
    let type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}

const excludeKeys = ['$$hashKey'];
const traverseArray = function (obj: any, isObj?: boolean, attr?: string, res?: any) {
    //数据初始化
    res = res ? res : {};
    attr = attr ? attr : '';
    //执行数据转换
    if (obj && isObject(obj) && obj.toString().indexOf('[object File]') === -1) {
        let attrRes;
        if (Array.isArray(obj)) {//是数组转换成[?]的形式
            for (let [index, item] of (obj as []).entries()) {
                attrRes = attr;//备份属性名称
                attr += '[' + index + '].';
                res = traverseArray(item, isObj, attr, res);
                attr = attrRes;//还原属性名称
            }
        } else {
            for (let index of Object.keys(obj)) {
                let item = obj[index];
                attrRes = attr;
                if (isObject(item) && item.toString().indexOf('[object File]') === -1 && !Array.isArray(item) && isObj) {//如果item是一个对象且不是一个数组就增加点,否则增加[?]
                    attr += index + '.';
                } else {
                    attr += index;
                }
                res = traverseArray(item, isObj, attr, res);
                attr = attrRes;
            }
        }
    } else {
        if (!excludeKeys.includes(attr)) {
            res[attr] = obj;
        }
    }
    return res;
};

//寻找下节点
const findComponentsDownward = function (context: Vue, componentName: string): Vue[] {
    return context.$children.reduce((components: Vue[], child: Vue) => {
        if (child.$options.name === componentName) components.push(child);
        const foundChilds = findComponentsDownward(child, componentName);
        return components.concat(foundChilds);
    }, []);
};

//寻找上节点
const findComponentUpward = function (context: Vue, componentName: string | string[]) {
    let componentNames: string[];
    if (typeof componentName === 'string') {
        componentNames = [componentName];
    } else {
        componentNames = componentName;
    }

    let parent = context.$parent;
    let name = parent.$options.name;
    while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
    }
    return parent;
};

//读取文件
const readAsDataURL = function (file:File, cb:Function) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e:any) {
        if (cb) {
            cb(this.result, e.target.result);
        }

    }
};

//获取列表当前选项
const listIsCheck = function (value:any,key:string) {
    let a = value.filter((item:any) => item.IsCheck);
    if (key){
        let b = a.map((item:any) => item[key]);
        return b;
    }else {
        return a;
    }
};

//根据key生成数据
const getKeyData = function (data: any, key: any) {
    let dataKey: any = {};
    let type: string = '';
    if (new String(key) instanceof String) type = 'String';
    if (key instanceof Object) type = 'Object';
    if (key instanceof Array) type = 'Array';
    let obj: any = {
        "String": () => {
            dataKey[key] = data || undefined
        },
        "Object": () => {
            _.forOwn(key, (item, key) => {
                dataKey[key] = data[key] || undefined;
            });
        },
        "Array": () => {
            key.map((res: any) => {
                let a: any[] = [];
                data.map((v: any) => {
                    a.push(v[res])
                });
                dataKey[res] = a || undefined;
            });
        }
    };
    obj[type]();
    return dataKey;
};


const downloadFile = function(method="post",url:string, params:any, fileName:string) {
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: url,
            params: params,
            responseType: 'blob'
        })
        .then(res => {
            let blob = new Blob([res.data]);
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = fileName; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
            resolve(res.data);
        })
    });
}

export {
    findComponentsDownward,
    findComponentUpward,
    readAsDataURL,
    traversingTree,
    overwriteEnum,
    isObject,
    traverseArray,
    listIsCheck,
    getKeyData,
    downloadFile
}
