const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//获取当前的环境变量process.env.NODE_ENV
//NODE_ENV值一般在package.json文件中通过脚本命令定义，如cross-env NODE_ENV=production
const devMode = process.env.NODE_ENV !== 'production'

//将相对路径解析为绝对路径，__dirname为当前文件所在的目录下，此处为./webpack文件夹
function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigBase = {
  //entery为webpack解析的入口（解析各种包依赖关系的入口），而不是项目访问的入口
  //官网描述：指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
  entry: {
    app: [resolve('../src/index.js')], 
  },

  //output为项目打包后的输出位置
  //官网描述：告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist
  output: {
    path: resolve('../dist'), //path为打包后的输出文件夹位置，此处为 ./dist文件夹
    filename: devMode ? 'js/[name].[hash].js' : 'js/[name].[contenthash].js', //打包后的入口文件的文件名
    chunkFilename: devMode ? 'chunks/[name].[hash:4].js' : 'chunks/[name].[contenthash].js', //非入口文件的文件名
    // publicPath:'',    //当在生产环境下会用到此，当需要将生产的包文件资源一起放到OSS上或采用CDN加速时，需要对资源加载路径重新命名，即改为publicPath+原路径
  },

  //resolve解析模块，主要用来定义路径别名
  resolve: {
    extensions: ['.js', '.jsx', '.json'], // 使用的扩展名
    alias: { // 定义别名，减少使用别名提高编译速速
      '@src': path.join(__dirname, '../src'),
      '@actions': path.join(__dirname, '../src/redux/actions'),
      '@reducers': path.join(__dirname, '../src/redux/reducers'),
      '@apis': path.join(__dirname, '../src/apis'),
      '@components': path.join(__dirname, '../src/components'),
      '@configs': path.join(__dirname, '../src/configs'),
      '@config': path.join(__dirname, '../src/configs/config.js'),
      '@ajax': path.join(__dirname, '../src/configs/ajax.js'),
      '@reg': path.join(__dirname, '../src/configs/regular.config.js'),
      '@images': path.join(__dirname, '../src/images'),
      '@pages': path.join(__dirname, '../src/pages'),
      '@base': path.join(__dirname, '../src/pages/base'),
      '@menu': path.join(__dirname, '../src/pages/menu'),
      '@set': path.join(__dirname, '../src/pages/set'),
      '@styles': path.join(__dirname, '../src/styles'),
      // 'react-dom': devMode ? '@hot-loader/react-dom' : 'react-dom', // react-hot-loader需要
    },
  },

  //
  optimization: {
    usedExports: true,
    //将runtime文件单独拆分出来，因为每次打包或者更改时,runtime内容都会更改，若将其与包一起打包，则每次更新必然是所有包的更新，效率很低
    //所以一般将其拆除，直接内联到html中
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
    //内置的拆包API
    splitChunks: {
      chunks: "all", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
      minSize: 30000, // 模块超过30k自动被抽离成公共模块
      minChunks: 1, // 模块被引用>=1次，便分割
      name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
      automaticNameDelimiter: '~', // 命名分隔符
      cacheGroups: {
        //default会将自定义代码部分默认打成一个包，即src里的js代码
        default: { // 模块缓存规则，设置为false，默认缓存组将禁用
          minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
          priority: -20, // 优先级，优先级越高则越先拆包，即对于同一个依赖包，该依赖包会优先被打包进优先级高的包里
          reuseExistingChunk: true, // 默认使用已有的模块
        },
        //vendor将node_modules文件夹下的内容都统一打包到wendor中，因为一般第三方插件的内容不会轻易改变
        //此处也是拆包的重点区域，因为node_module里的内容太多，打出来的包会很大，在首页一次加载会影响加载速度，所以会将一些不常用且非必须的包拆出来，
        //如echart等，后面通过动态加载的方式引进来
        vendor: {
          test: /[\\/]node_modules[\\/]/,   //匹配的规则，可以为文件夹，也可以为具体的文件，如 指定文件夹/[\\/]node_modules[\\/]/,待指定后缀文件 /\.(css|less)$/,具体文件/base.less|index.less/
          name: 'vendor',  //此处的name,即为打包后包的name
          priority: -10,// 确定模块打入的优先级
          reuseExistingChunk: true,// 使用复用已经存在的模块
          enforce: true,
        },
        styles: {
          // test: /\.(css|less)$/,
          test: /base.less|index.less/,
          name: 'styles',
          priority: 10,// 确定模块打入的优先级
          chunks:'all',
          enforce: true,
        },
        antd: {
          test: /[\\/]node_modules[\\/]antd/,
          name: 'antd',
          priority: 15,// 确定模块打入的优先级
          enforce: true,
        },
        echarts: {
          test: /[\\/]node_modules[\\/]echarts|echarts-for-react/,
          name: 'echarts',
          priority: 16,
          reuseExistingChunk: true,
        }
      },
    },
  },
  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
      {
        test: /\.js$/,
        // include: [resolve('../src')],
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          }
        }
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              //公共路径,默认情况下，使用的是webpackOptions.output中publicPath,  
              //当在output中设置publicPath后，必须要在此loder中定义一个publicPath为./ 否则会在访问css里的图片引用时，出现publicPath重复问题，./aa/aa这样
              // publicPath: './',   
              hmr: devMode, //开发环境配置热更新
            },
          },
           'css-loader',
           {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('autoprefixer')()
              ],
            }
          },
           { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } } // 此处用less-loader解析antd.less，必须写成下面格式
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        // include: [resolve('../src/images')],
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[hash:4].[ext]',
          outputPath: '/img'
        }
      },
      {
        test: /\.(woff|eot|ttf|svg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'font/[name].[hash:4].[ext]'
        }
      }
    ]
  },

  plugins: [
    //为项目生成一个可以访问的html文件，否则全是.js文件，没有访问的页面入口。默认为index.html
    new HtmlWebpackPlugin({
      template: './public/index.html',  //引用模板html文件生成项目的入口文件html
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]), //内联也可以尝试script-ext-html-webpack-plugin
    new HardSourceWebpackPlugin(),   //一个打包缓存插件，可以极大的增加webpack打包的速度，替代dll插件
    //将css文件单独拆出来打包，通过配置filename，chunkFilename来将css拆成一个一个的单个文件，而不是所有css打包成一个文件
    //可配合splitChunks的cacheGroups将想要的css文件合并打包
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/style.css':'css/style.[contenthash].css',
      chunkFilename: devMode ? 'css/style.[id].css':'css/style.[contenthash].[id].css'
    }),
    new CleanWebpackPlugin() //每次执行都将清空一下./dist目录
  ]
}
module.exports = webpackConfigBase