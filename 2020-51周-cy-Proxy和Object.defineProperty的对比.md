# Proxy和Object.defineProperty的对比

都是控制任何目标 Object, Proxy要更为强大一些。

例子
```
let target = {
  x: 10,
  y: 20
}

let hanler = {
  get: (obj, prop) => 42
}

target = new Proxy(target, hanler)

target.x //42
target.y //42
target.x // 42

```

## Proxy
 Proxy 支持的拦截操作一览，一共 13 种。

```

get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
```

### get
get方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象

```
const proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true
```


```
var person = {
  name: "张三"
};

var proxy = new Proxy(person, {
  get: function(target, propKey) {
    if (propKey in target) {
      return target[propKey];
    } else {
      throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
    }
  }
});

proxy.name // "张三"
proxy.age // 抛出一个错误
```
如果没有这个拦截函数，只会返回undefined


## Object.defineProperty

Object.defineProperty(obj, prop, desc)

1. obj 需要定义属性的当前对象
2. prop 当前需要定义的属性名
3. desc 属性描述符  

下面一个简单的输入框变化，数据展示:
```
var obj = {
    value:''
}
var value = '';
Object.defineProperty(obj,"value",{
    get:function(){
        return value
    },
    set:function(newVal){
        value = newVal
    }
})
document.querySelector('#input').oninput = function(){
    var value = this.value;
    obj.value = value;
    document.querySelector('#text').innerHTML = obj.value;
}
```

## 对比

Proxy 的优势如下:

1. Proxy 可以直接监听对象而非属性；
2. Proxy 可以直接监听`数组`的变化；
3. Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
4. Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
5. Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

Object.defineProperty 的优势如下:  

兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平。

## 设计模式之：代理模式

Proxy是专门为对象设置访问代理器的，通过Proxy可以轻松监视到对象的读写过程，相比于defineProperty，Proxy他的功能要更为强大甚至使用起来也更为方便。


## 参考
[Proxy 阮一峰ES6](https://es6.ruanyifeng.com/#docs/proxy#%E6%A6%82%E8%BF%B0)  
[Proxy 的巧用](https://juejin.cn/post/6844904012790120462#heading-11)  
[Proxy 与Object.defineProperty介绍与对比](https://www.jianshu.com/p/d16565c6b6ee)
