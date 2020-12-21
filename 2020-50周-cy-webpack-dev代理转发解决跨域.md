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


## 附：跨域知识
前后端分离：
web服务器向数据服务器发送请求，存在跨域，cors。


### 跨域三条件
三个作为充分条件，必须满足全部  
　　1. 浏览器限制  
　　2. 跨域行为（域名，端口，协议不一样都是跨域）   
　　　　域名[主域名与子域名也算]不同  
　　　　端口不同  
　　　　协议不同  
　　　　特注：Ip与域名之间网络交互，也属于跨域，如：123.23.23.12 和 www.a.com  
　　3. XHR（XMLHttpRequest请求）  

### 解决方案

0. 服务器中间代理。eg: nginx（部署）、proxy（开发）
1. 被调用方设置允许跨域。
2. JSONP: 只支持GET请求，类似link
3. iframe等等

