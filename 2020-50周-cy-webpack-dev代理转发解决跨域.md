# webpack 代理转发配置

1. 如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。
2. 解决开发环境的跨域问题(不用在去配置nginx和host, 爽歪歪~~)

[webpack-proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy)

webpack-->webpack-dev-server-->`http-proxy-middleware`-->http-proxy


## webpack 中的配置

配置 proxy ，和 nignx 配置差不多。
```
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '/api': '/api' },
      }
    }
  }
};

```



## create-react-app

[create-react-app 开发中的代理](https://create-react-app.dev/docs/proxying-api-requests-in-development)

如果你使用的是 create-react-app，逻辑建议合并到 `src/setupProxy.js`

```
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
```

解决跨域的原理就是服务转发。
