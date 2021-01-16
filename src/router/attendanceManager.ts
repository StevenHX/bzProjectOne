import {getComponentByRootPath} from './util'

const rootPath = '/Attendances';
let getComponent;
//开发环境下不使用按需加载打包模式,提升打包速度
getComponent = getComponentByRootPath(rootPath);
const getPath = function (path: string) {
    return `${rootPath}${path}`;
}

export default [
    {
        path: rootPath,
        name: 'iMESX8云监控平台',
        icon: 'el-icon-s-custom',
        meta: {
            isMenu: true,
            isExpand: true
        },
        component: getComponent('Index'),
        children: [
            {
              path: getPath('/EquipList'),
              name: '设备管理',
              icon: 'el-icon-document',
              meta: {
                  isMenu: true,
                  needAuth: false
              },
              component: getComponent('EquipList'),
           },
           {
            path: getPath('/BridDetectList'),
            name: '驱鸟历史',
            icon: 'el-icon-document',
            meta: {
                isMenu: true,
                needAuth: false
            },
            component: getComponent('BridDetectList'),
         },
         {
          path: getPath('/PatrolList'),
          name: '巡逻配置',
          icon: 'el-icon-document',
          meta: {
              isMenu: true,
              needAuth: false
          },
          component: getComponent('PatrolList'),
       }
        ]
    }
]
