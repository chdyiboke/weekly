# 文档坐标和各种 height

下面吃参考链接，看图更形象！！！ 


## 背景

滚动的时候计算元素和页面顶部之间的距离，动态赋值，太恶心啦~~
```
const c= $0.height + $0.offsetTop
```
当前元素高度+ 元素与页面顶部距离。offsetTop 祖先元素有定位属性的话，还需要往上层计算。

## 获取当前元素到页面底部的距离

[获取当前元素到页面底部的距离](https://blog.csdn.net/weixin_42557996/article/details/103158928)
当前元素与底部的距离 = 可视区窗口高度 + 文档滚动高度 - 当前元素与页面顶部距离 - 当前元素高度

## 各种 height

每个HTML元素都具有clientHeight offsetHeight scrollHeight offsetTop scrollTop 这5个和元素高度、滚动、位置相关的属性

```
网页可见区域高：document.body.clientHeight // 可见高
网页正文全文高：document.body.scrollHeight // 总高度
网页可见区域高（包括边线的高）：document.body.offsetHeight // 可见内容+变线
网页被卷去的高：document.body.scrollTop // 滑动卷去的高
屏幕分辨率高：window.screen.height // 屏幕
```

offsetTop: 当前元素顶部距离最近父元素顶部的距离【距离元素最近的一个具有定位的祖宗元素（relative，absolute，fixed），若祖宗都不符合条件，offsetParent为body）】

估计还是傻傻分不清。

## 坐标

看下面的参考吧

## 参考

[搞清clientHeight、offsetHeight、scrollHeight、offsetTop、scrollTop](https://blog.csdn.net/qq_35430000/article/details/80277587)
[滚动与clientHeight值，width 与 clientWidth 的不同点](https://zh.javascript.info/size-and-scroll)
[坐标：x/y 和 width/height 对矩形进行了完整的描述](https://zh.javascript.info/coordinates)

