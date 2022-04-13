# 16周-cy-16周js周报

[Node.js 16](https://nodejs.org/zh-cn/)

## 启动TypeScript项目实用指南
在2021年-[启动TypeScript项目](https://www.metachris.com/2021/04/starting-a-typescript-project-in-2021/)的实用指南，包括（可选）esbuild捆绑，整理，用Jest测试，发布npm软件包等。

## Node 16 发布
[Node.js 16](https://nodejs.org/zh-cn/)已发布-16将立即用15.替换15.x作为“当前”发行版，因为它将在2021年10月成为LTS发行版（因此它将代号为“ Gallium”。）

[Node 16 发布，一大堆新特性来袭！！](https://juejin.cn/post/6953783749653823502)


## 解决的神秘行为parseInt()
parseInt(0.0000005)的回报5，因为..当然它😆德米特里挖成这种怪癖，并提出了自己的问题让你思考的问题。

https://dmitripavlutin.com/parseint-mystery-javascript/

```
const number = parseInt('100');
number; // 100

// 进制转换
const number = parseInt('100', 2);
number; // 4

parseInt(0.0000005); // => 5
String(0.000005); // => '0.000005'
String(0.0000005); // => '5e-7'
parseInt(0.0000005); // => 5
// same as
parseInt(5e-7);      // => 5
// same as
parseInt('5e-7');    // => 5

// 谜团已揭开！因为parseInt()总是将其第一个参数转换为字符串，
//所以小于10 -6的浮点数将以指数表示法编写。
//然后parseInt()从float的指数表示法中提取整数！


Math.floor("1.000005")  // 1
```
为了安全地提取浮点数的整数部分，建议使用以下Math.floor()函数


## 如何在Node.js中使用Puppeteer将HTML转换为图像

https://cheatcode.co/tutorials/how-to-convert-html-to-an-image-using-puppeteer-in-node-js

## Vue.js UI / UX库

墨水：可自定义的 [Vue.js UI / UX库](https://inkline.io/) -包括50多个为移动优先应用程序设计的组件，并通过WAI-ARIA提供开箱即用的可访问性支持。

https://sucrase.io/


## sucrase
https://sucrase.io/
编译比 Babel 快20倍的库。

