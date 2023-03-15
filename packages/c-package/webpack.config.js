const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   presets: ['@babel/preset-env', '@babel/preset-react'],
          //   // 如果在class组件中使用属性或者箭头函数之类的语法，必须要引入这个plugin
          //   // plugins: ['@babel/plugin-proposal-class-properties'],
          // },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
    ]
  },
  plugins:[new HtmlWebpackPlugin({template: './src/index.html'})],
  devServer: {
    open: true,
    port: 8080,
    hot: true,
    compress: true,
    writeToDisk: false,
  },
  devtool: "source-map",
};
