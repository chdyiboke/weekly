# Web Components

组件是前端的发展方向，现在流行的 React 和 Vue 都是组件框架。

谷歌公司由于掌握了 Chrome 浏览器，一直在推动浏览器的原生组件，即 Web Components API。相比第三方框架，原生组件简单直接，符合直觉，不用加载任何外部模块，代码量小。目前，它还在不断发展，但已经可用于生产环境。

![avatar](https://www.wangbase.com/blogimg/asset/201908/bg2019080604.jpg)

它是啥样子的？
```
class MyCom extends HTMLElement {
  constructor() {
    super();
    console.error(this.attributes);

    // this.innerHTML = '这是元素';
    this.innerHTML = '<div>这是元素</div>';
  }

  // render() {
  // }
}

customElements.define('my-com', MyCom);
```

## 例子

[纯粹的JavaScript创建Counter组件](https://webcomponents.dev/edit/sq69o4hRWDjdydMW1UZ2?embed=1&sv=1&pm=1)

下面是部分代码：
```
class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;

    const style = `
    ***
    `;

    const html = `
    <span class="large value">${this.count}</span>
    `;
    // 内部代码隐藏起来
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <style>
      ${style}
    </style>
    ${html}
    `;

  update() {
    this.spanValue.innerText = this.count;
  }

  connectedCallback() {
    this.buttonInc.addEventListener("click", this.inc);
  }
}

customElements.define("my-counter", MyCounter);

```

## 最后
和我们的编辑器一样，都是dom的直接操作，没有什么神秘的东西。 

原生组件如果成熟并且火起来，jq大法可能又要风靡一时了，玩笑话哈哈哈。

## 参考
[Web Components 入门实例教程-阮一峰](http://www.ruanyifeng.com/blog/2019/08/web_components.html)

[Web Components](https://juejin.cn/post/6868038526047846407)