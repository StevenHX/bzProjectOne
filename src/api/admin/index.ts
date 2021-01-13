import {AxiosRequestConfig} from 'axios'
import instance from './instance';

// 登录login
function login(name:any,pwd:any) {
  let i = instance({
    method: 'get',
    url:  '/BSAPI/Action/Login?Name='+name+'&Password='+pwd,
  });
  return (i as Promise<unknown>)
}

//获取驱鸟设备
function GetEquipList(opts?:AxiosRequestConfig) {
  let i = instance({
    method: 'post',
    url:  '/BSAPI/Query/GetEquipList',
    opts: opts
  });
  return (i as Promise<unknown>)
}

// 获取驱鸟历史列表
function GetBridDetectList(opts?:AxiosRequestConfig) {
  let i = instance({
    method: 'post',
    url:  '/BSAPI/Query/GetBridDetectList',
    opts: opts
  });
  return (i as Promise<unknown>)
}

// 获取巡逻配置列表
function GetPatrolList(opts?:AxiosRequestConfig) {
  let i = instance({
    method: 'post',
    url:  '/BSAPI/Query/GetPatrolList',
    opts: opts
  });
  return (i as Promise<unknown>)
}
export {
  login,
  GetEquipList,
  GetBridDetectList,
  GetPatrolList
};