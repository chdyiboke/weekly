# Proxy和Object.defineProperty的对比


Proxy要更为强大一些。

## Proxy

```
const person = {
    name: 'yd',
    age: 18
}

const personProxy = new Proxy(person, {
    get() {},
    set() {}
})
```




## Object.defineProperty



## 设计模式之：代理模式

Proxy是专门为对象设置访问代理器的，通过Proxy可以轻松监视到对象的读写过程，相比于defineProperty，Proxy他的功能要更为强大甚至使用起来也更为方便。



## 参考

[Proxy 的巧用](https://juejin.cn/post/6844904012790120462#heading-11)