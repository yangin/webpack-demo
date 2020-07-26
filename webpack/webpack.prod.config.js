const path = require('path');
const webpack = require('webpack');
const webpackConfigBase = require('./webpack.base.config');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigProd = {
  mode: 'production',
  devtool: 'cheap-module-eval-source-map',  //或使用'cheap-module-source-map'、'none'
  optimization: {
    minimizer: [
      // 压缩js代码
      new TerserJSPlugin({// 多进程压缩
        cache: path.resolve('.cache'),        // 设置缓存目录
        parallel: 4,// 开启多进程压缩
        terserOptions: {
          compress: {
            // drop_console: true,   // 删除所有的 `console` 语句
          },
        },
      }),
      //压缩css代码
      new OptimizeCSSAssetsPlugin()
    ],
  },
  // 压缩css代码
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }) //生成打包后的包分析报告
  ]
}
module.exports = merge(webpackConfigBase, webpackConfigProd)