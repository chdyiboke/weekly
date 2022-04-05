# vue-cli4 里面使用less（工程化相关）

官网：https://cli.vuejs.org/guide/

## 什么是cli?
命令行工具，可以很方便的创建项目，使用环境等等。

### Creating a Project

https://cli.vuejs.org/guide/creating-a-project.html#vue-create

```javascript
vue create my-project
```


## vue-cli4 里面使用less

如下：lang="less"，直接使用会报错。
```javascript
<style lang="less">
    .table_wrap{
        width:96%;
        padding:20px 10px;
    }
</style>
```
如何才能像下面那样在vue文件里面使用less呢？
## 正题

### 1、安装指定版本less
```javascript
npm i less@3.9.0 less-loader@4.1.0
```
最新版本的依赖包往往不稳定，容易出现问题


### 2、下载插件配置全局less变量
```javascript
npm i style-resources-loader vue-cli-plugin-style-resources-loader -D
```
### 3、在根目录新建vue.config.js
```javascript
const path = require("path");

module.exports = {
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [path.resolve(__dirname, "src/global.less")]
        }
    }
};
```

### 4、重启项目 
npm run serve

[演示-如果有时间的话]
