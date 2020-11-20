# How-To-use-lerna

包管理工具——lerna。

是一种比较流行的monorepo项目管理模式。近几年比较火的React,Vue,Babel都是用的这种模式:

官网：https://lerna.js.org/

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
mkdir package1
cd package1
npm init -y

cd packages
mkdir package2
cd package2
npm init -y
```
注意： package 如果我们要发布到npm上的，所以名字取特殊些，不能被人用过。

4、添加依赖
第一种方法是修改package1/package.json，添加
```
{
  "dependencies": {
    "package2": "^1.0.0"
  }
}

```
然后运行lerna bootstrap


第二种方法是直接使用命令add

```
lerna add package2 --scope=package1
```

运行之后，我们发现package1生成了node_modules，而node_modules里生成了指向package2的软链，类似npm link的效果

5、常用命令

```
lerna init #初始化
lerna bootstrap #下载依赖包或者生成本地软连接
lerna add axios #所有包都添加axios
lerna add package2 --scope=package1 #给包package1x添加package2依赖
lerna list/ls
lerna run [script] #所有包都执行[script]
lerna publish #创建一个新版本的已更新的软件包，更新npm
lerna changed #检查上次有哪些包有更改
lerna diff [package?] #自上次发行以来，比较所有软件包或单个软件包。
lerna link #建立包的软链接 类似npm link
lerna clean #清除所有包的 node_modules 目录

```

## 彩蛋：如何发布一个react的npm包？

第48周详解

## 参考

[lerna中文文档详解](https://segmentfault.com/a/1190000019350611)
[lerna管理package](https://juejin.im/post/6844903885312622606)







