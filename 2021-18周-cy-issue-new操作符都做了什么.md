# new操作符都做了什么?

## new

```javascript
function A(){
}
var aa = new A();

new操作符都做了什么?
里面有几条原型链？

```


## 回答

1. 创建一个空对象obj。
2. 设置原型链，属性和方法。obj.proto= A.prototype;
3. this指向创建的实例。var res = A.call(obj);  如果，返回值res为对象且不为null 返回 res，则返回obj。

```javascript
function myNew(fn, ...args) {
  let obj = {};
  obj.__proto__ = fn.prototype;
  let result = fn.call(obj, ...args); // this 指向创建的实例
  debugger;
  return result instanceof Object ? result : obj;
}

function Dog() {
  this.a = 1;

  // return aa;
}
Dog.prototype.aa = 2;
const dog = myNew(Dog);
console.log(dog.a); // 1
```

2 条原型链：

1. aa.proto === A.prototype
2. A.proto === Function.prototype