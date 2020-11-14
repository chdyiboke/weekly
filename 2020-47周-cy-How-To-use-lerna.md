# How-To-use-lerna

包管理工具——lerna。

是一种比较流行的monorepo项目管理模式。近几年比较火的React,Vue,Babel都是用的这种模式:

## 使用介绍
1、全局安装lerna

```
npm install lerna -g
```

2、初始化项目仓库

lerna init

```
\\ lerna.json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0" // 共用的版本，由lerna管理
}
```

3、创建2个 package

```
cd packages
mkdir prpr-lerna-core
cd prpr-lerna-core
npm init -y

cd packages
mkdir prpr-lerna-popular
cd prpr-lerna-popular
npm init -y
```
注意： package 如果我们要发布到npm上的，所以名字请取特殊些，不能被人用过。

4、添加依赖
第一种方法是修改prpr-lerna-popular/package.json，添加
```
{
  "dependencies": {
    "prpr-lerna-core": "^1.0.0"
  }
}

```
然后运行lerna bootstrap


第二种方法是直接使用命令add

```
lerna add prpr-lerna-core --scope=prpr-lerna-popular
```

运行之后，我们发现prpr-lerna-popular生成了node_modules，而node_modules里生成了指向prpr-lerna-core的软链，类似npm link的效果

5、常用命令

```
lerna init #初始化
lerna bootstrap #下载依赖包或者生成本地软连接
lerna add axios #所有包都添加axios
lerna add prpr-lerna-core --scope=prpr-lerna-popular #给包prpr-lerna-popularx添加prpr-lerna-core依赖
lerna list
lerna clean

```



## 参考

[lerna管理package](https://juejin.im/post/6844903885312622606)







