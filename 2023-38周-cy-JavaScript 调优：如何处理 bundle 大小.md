# JavaScript bundle 大小

https://juejin.cn/post/6935306384724459551

## gzip

content-Encoding: gzip

未压缩大小影响浏览器解析、编译和执行 JavaScript 所需的时间

## 炫酷的包分析

```js
"report": "vue-cli-service build --mode prod --report",

npm run report
```

vue-cli 本身就支持了这个功能，上面的命令生成 report.html 类似下面的效果

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84b3ae159a104a54a72ea0d599fa790e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp" />
