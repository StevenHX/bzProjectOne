import { createAPI } from '../util';
import config from '../config';
let mockConfig:{
  //允许任意属性存在
  [propName: string]: string
} = {
  mock: '',
  dev: '',
  pre: '',
  prod: ''
}
const baseUrl:string = mockConfig[config.env || 'mock'];

export default createAPI(baseUrl);

