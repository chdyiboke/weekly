# 如何发布一个react的npm包

## 制作

### package.json
// package.json
    
```
"main": "dist/bundle.js",
"files": ["dist"],
"scripts": {
    "start": "webpack-dev-server --config webpack.dev.config.js",
    "dev": "webpack-dev-server --config webpack.dev.config.js",
    "build": "webpack --config webpack.prod.config.js"
  },
```
接下来安装依赖

```
npm i react react-dom
npm i -D  babel-loader @babel/core @babel/preset-env @babel/preset-react webpack webpack-dev-server webpack-cli html-webpack-plugin webpack-node-externals css-loader style-loader 
```

依赖版本的升级很快，所以如果读者发现依赖有问题，请参考官方文档正确安装。

### 配置 webpack

webpack 开发配置
```
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.cm\.styl$/,
        loader: 'style-loader!css-loader?modules&camelCase&localIdentName=[local]-[hash:base64:5]!stylus-loader'
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'public/index.html'
    })
  ],
};

```


production 打包配置，区别是改变了 entry，因为我们只需要单独的组件，并且改变了 libraryTarget，这个配置项的默认参数是 'var'，我们需要改成 commonjs2，这样可以通过模块系统引入这个组件。另一点区别是使用了 nodeExternals 使得打包的组件中不包括任何 node_modules 里面的第三方组件，起到减小体积的作用。

```
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.cm\.styl$/,
        loader: 'style-loader!css-loader?modules&camelCase&localIdentName=[local]-[hash:base64:5]!stylus-loader'
      }
    ]
  },
  externals: [nodeExternals()]
};


```

.babelrc
```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```


## 发布

发布一个npm包，首先需要一个账号

1. 然后登录
```
npm login

Username: ma_memg       //输入用户名
Password:               //输入密码
Email: (this IS public) //输入注册邮箱

```
不放心可以用一下命令查一下当前npm账户是谁

```
npm who am i
```

2. 发布流程是先npm run build 然后 npm publish

3. 上传完成之后， www.npmjs.com 查看有没有发布成功


[npm 文档](https://www.npmjs.cn/)  
[如何创建react组件并发布npm](https://www.cnblogs.com/thinkingthigh/p/11603962.html)
