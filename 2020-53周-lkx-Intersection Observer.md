# 实现高性能延迟加载的最新API：Intersection Observer

## 什么是IntersectionObserver
与多年前相比，Intersection Observer是用于检测性能更好的元素的新API，原因如下

* 滚动页面时延迟加载图像或其他内容
* 实现“无限滚动”的网站，当你滚动时，越来越多的内容会被加载和渲染，这样用户就不用再翻页了。
* 报告广告的可见度，以便计算广告收入。
* 根据用户是否会看到结果来决定是否执行任务或动画过程。

Intersection Observer是一个两个数组的构造函数。它需要一个回调函数，每当它所监视的元素出现在浏览器中时，这个回调函数就会被启动，并且需要一个包含信息的可选对象

## 为什么Intersection Observer更好？

当过去需要无限滚动时，因为需要检查滚动条当前位置的 getClientBoundingRect 会强制页面回流。
随着时间的推移，新的强大功能——Intersection Observer应运而生，推荐使用它进行无限滚动。但是，它仍然使用getClientBoundingRect 来获取它所观察的元素的位置。那为什么认为它更好呢？
Intersection Observer调用带有 requestIdleCallback 的回调函数，当当前 tick 期间没有任务运行时，该函数就会被启动。因此，尽管使用Intersection Observer的旧方式和新方式都可能导致回流，但Intersection Observer只在空闲期运行回调函数，因此在性能上更好。

## 正常的卡片视图
![avatar](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98a800703f1744fea8577ecff0b2aafb~tplv-k3u1fbpfcp-zoom-1.image) 


本页面一次性加载约50张物品卡，在第一次渲染时也会加载约50张图片。
![avatar](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce952c503c3a4f86adc74c7ff2f4050d~tplv-k3u1fbpfcp-zoom-1.image) 


如果屏幕上需要渲染成千上万张图像该怎么办？轻松理解我观点的最好例子是思考Pinterest的工作原理。他们会在第一次看到的时候向你展示各种图片，每当你向下滚动到底部的时候——惰性加载。
那么如何使用Intersection Observer实现延迟加载？这很简单。设置触发回调函数的阈值，并使Intersection Observer API继续监视该元素。

```js
const intersectionCallback = entries => {
  entries.forEach(entry => {
    // 如果元素在浏览器中显示的比例超过50％
    if (entry.intersectionRatio > 0.5) {
      // 图像加载...
      ...
    }
  }); 
}

const IntersectionObserver = new IntersectionObserver(intersectionCallback, {
  threshold: [0.5],  
});
```

这是您可以传递到Intersection Observer的属性的列表。

1. root —— Intersection Observer将跟踪的根元素，如果省略它，根元素将被设置为视口的
2. rootMargin —— 根元素的边距值，该规则与CSS边距相同。例如，如果rootMargin设置为“50px 0px 0px 0px”，根元素的区域将更改为不可见元素，其顶偏移量为原始根元素的50px。
3. threshold —— 数组中的值，每当跟踪元素通过阈值时，就会触发回调。如果阈值设置为[0，0.5，1]，当跟踪元素通过0%，50%和100%的点时，将启动回调，这指的是它在根元素上显示的程度。


## 懒加载卡片视图
在此示例的延迟加载中，仅当每张图片在屏幕上的显示比例超过50％时，才会加载每张图片。
![avatar](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f368117be04499ba438afb98ad99c70~tplv-k3u1fbpfcp-zoom-1.image) 


看到只有向下滚动时加载的图像计数在增加吗？由于使用了Intersection Observer，因此只有在适当的时候才允许浏览器加载图像。

## 浏览器支持
![avatar](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0419da521cd74002bd348b58bda96c2e~tplv-k3u1fbpfcp-zoom-1.image) 


## NPM中著名的Lazy-Load程序包
1. react-lazy-load：https://www.npmjs.com/package/react-lazy-load
2. vanilla-lazyload：https://www.npmjs.com/package/vanilla-lazyload
3. jquery-lazy：https://www.npmjs.com/package/jquery-lazy
4. ......

## 总结
Intersection Observer是一个浏览器专用的功能，它可以让你实现懒加载。您可以惰性地加载图片或重磅内容，以减少用户看到内容所需等待的总时间。
不过，IntersectionObserver并不是所有的浏览器都完全支持，所以一定要检查polyfill，或者你可以考虑安装一个已经做好的包。

## 参考链接
https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Creating_an_intersection_observer

