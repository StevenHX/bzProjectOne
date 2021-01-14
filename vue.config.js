const pkg = require('./package.json');
//系统版本
process.env.VUE_APP_VERSION = pkg.version;

let config = {
    publicPath: '/'
};
let proxy = {};

proxy[process.env['VUE_APP_SERVICE_PATH']] = {
    target: process.env['VUE_APP_SERVICE_URL'],
    ws: true,
    changeOrigin: true
};

proxy[process.env['VUE_APP_SERVICE_VIDEO_PATH']] = {
    target: process.env['VUE_APP_SERVICE_URL'],
    ws: true,
    changeOrigin: true
};

config.devServer =  {
    proxy: proxy,
    port: 8080
};
//scss全局变量导入
config.css = {
    loaderOptions: {
        sass: {
            prependData: '@import "@/scss/settings.scss";'
        }
    },
    extract: false
}
//显式通过babel-loader转义文件
config.transpileDependencies = ['vuex-module-decorators'];

if (process.env.NODE_ENV === 'production') {
    config.configureWebpack = config => {
        config.plugins.forEach((item, i) => {
            if (item.tsconfig) {
                config.plugins.splice(i, 1)
            }
        })
    }
}

module.exports = config
