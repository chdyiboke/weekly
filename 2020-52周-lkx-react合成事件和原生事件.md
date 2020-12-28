# react合成事件和原生事件

## 导火索

编辑器vision多页面需要选中画布，即在画布添加click事件，同时画布中的元素也有click事件，在元素click事件添加e.stopPropagation()方法，阻止事件冒泡，但点击画布中元素时仍会触发画布click事件，假的事件冒泡？

## 事件委托
React运用了事件委托，react 它接管了浏览器事件的优化策略，然后自身实现了一套自己的事件机制，而且特别贴心，它把浏览器的不同差异，都帮你消除了 ~

React 实现了一个合成事件层，就是这个事件层，把 IE 和 W3C 标准之间的兼容问题给消除了。

## 合成事件和原生事件
原生事件: 在 componentDidMount生命周期里边进行addEventListener绑定的事件

合成事件: 通过 JSX 方式绑定的事件，比如 onClick={() => this.handle()}

因为合成事件的触发是基于浏览器的事件机制来实现的，通过冒泡机制冒泡到最顶层元素，然后再由 dispatchEvent 统一去处理

回顾一下浏览器事件机制
![avatar](https://user-gold-cdn.xitu.io/2019/11/6/16e40265cacd921f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1) 

浏览器事件的执行需要经过三个阶段，捕获阶段-目标元素阶段-冒泡阶段。

🙋 Question: 此时对于合成事件进行阻止，原生事件会执行吗？答案是: 会！

📢 Answer: 因为原生事件先于合成事件执行 (个人理解: 注册的原生事件已经执行，而合成事件处于目标阶段，它阻止的冒泡只是阻止合成的事件冒泡，但是原生事件在捕获阶段就已经执行了)

## 为什么有合成事件的抽象？

如果DOM上绑定了过多的事件处理函数，整个页面响应以及内存占用可能都会受到影响。React为了避免这类DOM事件滥用，同时屏蔽底层不同浏览器之间的事件系统差异，实现了一个中间层——SyntheticEvent。

## 合成事件原理
React中，如果需要绑定事件，我们常常在jsx中这么写：
```js
<div onClick={this.onClick}>
	react事件
</div>
```
原理大致如下：
React并不是将click事件绑在该div的真实DOM上，而是在document处监听所有支持的事件，当事件发生并冒泡至document处时，React将事件内容封装并交由真正的处理函数运行。
以上面的代码为例，整个事件生命周期示意如下：
![avatar](https://user-gold-cdn.xitu.io/2017/10/9/8792eeae6dc6011274986acf42a76b15?imageView2/0/w/1280/h/960/format/webp/ignore-error/1) 

## 合成事件特点

React 自己实现了这么一套事件机制，它在 DOM 事件体系基础上做了改进，减少了内存的消耗，并且最大程度上解决了 IE 等浏览器的不兼容问题
那它有什么特点？

* React 上注册的事件最终会绑定在document这个 DOM 上，而不是 React 组件对应的 DOM(减少内存开销就是因为所有的事件都绑定在 document 上，其他节点没有绑定事件)

* React 自身实现了一套事件冒泡机制，所以这也就是为什么我们 event.stopPropagation() 无效的原因。

* React 通过队列的形式，从触发的组件向父组件回溯，然后调用他们 JSX 中定义的 callback

* React 有一套自己的合成事件 SyntheticEvent，不是原生的，这个可以自己去看官网


React 通过对象池的形式管理合成事件对象的创建和销毁，减少了垃圾的生成和新对象内存的分配，提高了性能

## 如何在React中使用原生事件
虽然React封装了几乎所有的原生事件，但诸如：

* Modal开启以后点其他空白区域需要关闭Modal
* 引入了一些以原生事件实现的第三方库，并且相互之间需要有交互

等等场景时，不得不使用原生事件来进行业务逻辑处理。
由于原生事件需要绑定在真实DOM上，所以一般是在componentDidMount阶段/ref的函数执行阶段进行绑定操作，在componentWillUnmount阶段进行解绑操作以避免内存泄漏。

## 合成事件和原生事件混合使用
如果业务场景中需要混用合成事件和原生事件，那使用过程中需要注意如下几点：
### 响应顺序
栗子：
```js
class Demo extends React.PureComponent {
    componentDidMount() {
        const $this = ReactDOM.findDOMNode(this)
        $this.addEventListener('click', this.onDOMClick, false)
    }

    onDOMClick = evt => {
        console.log('dom event')
    }
    
    onClick = evt => {
        console.log('react event')
    }

    render() {
        return (
            <div onClick={this.onClick}>Demo</div>
        )
    }
}
```
分析：首先DOM事件监听器被执行，然后事件继续冒泡至document，合成事件监听器再被执行。

结果：
```js
dom event react event
```

### 阻止冒泡
那，如果在onDOMClick中调用evt.stopPropagation()呢？

由于DOM事件被阻止冒泡了，无法到达document，所以合成事件自然不会被触发，控制台输出就变成了：
```js
dom event
```
复杂栗子：
```js
class Demo extends React.PureComponent {
    componentDidMount() {
        const $parent = ReactDOM.findDOMNode(this)
        const $child = $parent.querySelector('.child')
        
        $parent.addEventListener('click', this.onParentDOMClick, false)
        $child.addEventListener('click', this.onChildDOMClick, false)
    }

    onParentDOMClick = evt => {
        console.log('parent dom event')
    }
    
    onChildDOMClick = evt => {
        console.log('child dom event')
    }    
    
    onParentClick = evt => {
        console.log('parent react event')
    }

    onChildClick = evt => {
        console.log('child react event')
    }

    render() {
        return (
            <div onClick={this.onParentClick}>
                <div className="child" onClick={this.onChildClick}>
                    Demo
                </div>
            </div>
        )
    }
}
```
如果在onChildClick中调用evt.stopPropagtion()，则控制台输出变为：
```js
child dom event parent dom event child react event
```
这样的结果是因为React给合成事件封装的stopPropagation函数在调用时给自己加了个isPropagationStopped的标记位来确定后续监听器是否执行。

源码如下：
```js
for (var i = 0; i < dispatchListeners.length; i++) {
  if (event.isPropagationStopped()) {
    break;
  }
  // Listeners and Instances are two parallel arrays that are always in sync.
  if (dispatchListeners[i](event, dispatchInstances[i])) {
    return dispatchInstances[i];
  }
}
```

### nativeEvent在React事件体系中的尴尬位置
有人或许有疑问，虽然响应顺序上合成事件晚于原生事件，那在合成事件中是否可以影响原生事件的监听器执行呢？答案是（几乎）不可能。。。
我们知道，React事件监听器中获得的入参并不是浏览器原生事件，原生事件可以通过evt.nativeEvent来获取。但令人尴尬的是，nativeEvent的作用非常小。

### stopPropagation
在使用者的期望中，stopPropagation是用来阻止当前DOM的原生事件冒泡。

但通过上一节合成事件的原理可知，实际上该方法被调用时，实际作用是在DOM最外层阻止冒泡，并不符合预期。

### stopImmediatePropagation
stopImmediatePropagation常常在多个第三方库混用时，用来阻止多个事件监听器中的非必要执行。
但React体系中，一个组件只能绑定一个同类型的事件监听器（重复定义时，后面的监听器会覆盖之前的），所以合成事件甚至都不去封装stopImmediatePropagation。
事实上nativeEvent的stopImmediatePropagation只能阻止绑定在document上的事件监听器。

## 源码解析
https://juejin.cn/post/6844903988794671117#heading-5


## 参考
https://juejin.cn/post/6909271104440205326
