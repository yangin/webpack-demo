const path = require('path');
const webpack = require('webpack');
const webpackConfigBase = require('./webpack.base.config');
const { merge } = require('webpack-merge');

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigDev = {
  mode: 'development', //设置为development模式
  devtool: 'cheap-module-eval-source-map',   //生成source-map，方便在页面端定位报错，否则都是压缩后的代码，没法定位错误
  //devServer 为热更新服务，通过hot:true来启动
  devServer: {
    // proxy: { // proxy URLs to backend development server
    //   '/api': 'http://localhost:3000'
    // },
    contentBase: resolve('../dist'),  //启动的目录
    historyApiFallback: true,   //为true时，当路径找不到时，即404时，会重新加载本页面，否则报错。当react-router为BrowserRouter时，需要配置为true,否则原路径刷新报错，此时也可以用HashRoute来代替
    // compress: true, // enable gzip compression
    hot: true,
    open: true,    //启动后是否在浏览器自动打开
    host: 'localhost',
    port: 8090,
  },

  plugins: [
    new webpack.NamedModulesPlugin(),  //启用模块名，来代替moduleId，因为热更新默认会为每个module以id命名，当一个module删除时，其他module的id需要重排，因此都会重新更新，不利于局部热更新
    new webpack.HotModuleReplacementPlugin()  //热模块替换，实现局部热更新
  ]
}

module.exports = merge(webpackConfigBase, webpackConfigDev)