/**
 * Created by zhangbin on 2020/5/27.
 */
let sw2dts = require('sw2dts');
let fs = require('fs')
let http = require('http')


let swaggerUrls = [
    {
        content: 'admin',
        url: 'http://192.168.22.38:8085/swagger/v1/swagger.json'
    },
    // {
    //     content: 'hrms',
    //     url: 'http://192.168.0.150:8090/swagger/v1/swagger.json'
    // }
]

for (let sys of swaggerUrls) {
    http.get(sys.url, (res) => {
        let resStr = "";
        res.on("data", (res) => {
            resStr += res;
        });
        res.on("end", () => {
            let data = JSON.parse(resStr)

            //转化枚举类型,目前只转换第一层的枚举值复杂类型出现时再考虑
            let def = data.definitions
            for (let key of Object.keys(def)) {
                let item = def[key]
                if (item.type === 'object' && item.properties) {
                    for (let attrKey of Object.keys(item.properties)) {
                        let attrItem = item.properties[attrKey]
                        if (attrItem.enum && attrItem.enum.length) {
                            //转化枚举的格式
                            item.properties[attrKey] = {
                                type: 'object',
                                description: attrItem.description,
                                properties: {
                                    name: {
                                        type: 'string',
                                        enum: attrItem.enum
                                    },
                                    disName: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //todo 移除报错的属性(可能是后端格式问题)
            delete data.definitions.MapOfstringAndListOfEnum

            let option = {
                namespace: 'serviceType',
                // includes GET query parameters.
                withQuery: true
            };

            sw2dts.convert(data, option).then(dts => {
                //写入文件
                fs.writeFileSync(`./src/types/service-${sys.content}-type.d.ts`, dts)
            });
        });
    })
}



