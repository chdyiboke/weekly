# 问题描述

在JavaScript中，数值的比较是简单的，可以通过 相等== 或者全等=== 进行比较，这两个运算符可以对大多数非对象类型进行比较，那对象object可以有几种方法来比较呢？

# 解决办法

Object的比较方法可以从两个方面来考虑：严格比较和松散比较

## 严格比较

顾名思义：严格比较就是只比较对象是否为同一个对象
对于两个引用相同的对象进行以下三种比较，返回结果均为true

* 相等（==）符号

* 全等（===）符号

* Object.js()

当您想比较对象引用而不是它们的内容时，以上方法很有用。
但是在大多数情况下，您需要比较对象的实际内容：属性及其值，就可以参照下面的松散比较。

## 松散比较

顾名思义：松散比较就是只比较对象的值是否相等而不比较是否为同一个对象

* 手动比较
```javascript
function isObjectValueEqual(obj1, obj2) {
    return obj1.name === obj2.name) 
}

const object1 = {
    name: 'lkx',
};
const object2 = {
    name: 'lkx',
}
const object3 = {
    name: 'hpy',
}

isObjectValueEqual(object1,object2);    //true
isObjectValueEqual(object1,object3);    //false
```
对于具有少数的属性的简单对象，手动比较比较方便，对于比较大的对象，需要大量的样板代码，过于死板和繁琐

* 浅比较

浅比较相对于手动比较，解决了对于较大对象比较死板和繁琐的缺点
```javascript
function isObjectValueEqual(obj1, obj2) {
  const key1 = Object.keys(obj1);
  const key2 = Object.keys(obj2);

  if (key1.length !== key2.length) {
    return false;
  }

  for (let item of key1) {
    if (obj1[item] !== obj2[item]) {
      return false;
    }
  }

  return true;
}
```
浅比较也是有缺点的，浅比较只能单层对象进行比较，浅对象是对对象的属性值进行是否相等的比较 对于嵌套的对象判断是否相等则会返回false，这时就需要用到下面的深比较了

* 深比较

深比较的原理很简单，就是利用递归方法来对比对象值，若遇到了对象简单值则直接进行比较，若遇到复杂对象则逐个key进行比较，以此类推
```javascript
function isObjectValueEqual(obj1, obj2) {
  const key1 = Object.keys(obj1);
  const key2 = Object.keys(obj2);

  if (key1.length !== key2.length) {
    return false;
  }

  for (const item of key1) {
    const val1 = obj1[item];
    const val2 = obj2[item]];
    const areObject = isObject(val1) && isObject(val2);
    if (
      (areObject && !isObjectValueEqual(val1, val2)) ||
      (!areObject && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return obj.constructor === Object
}
```
深对比会造成性能损耗，由于使用了递归，在对象复杂时，深对比甚至会导致严重的性能问题。

* JSON.stringify

如果觉得深比较比较麻烦，那么JSON.stringify可以很好的帮助到你，它将对象转换为字符串，将转化后的字符串进行值比较，无论是单层对象还是嵌套对象都可以达到目的

# 总结

使用全等（===）、相等（==）或Object.is()可以确定对象是否是同一物体的实例。

手动相等性检查需要对属性值进行手动比较。虽然此检查需要手动编写要比较的属性，但对于简单对象来说更方便。

当比较的对象具有很多属性或在运行时确定对象的结构时，更好的方法是使用浅层检查。

如果比较的对象具有嵌套对象，则要进行深度相等检查或JSON.stringify。

浅比较、深比较的原理同样可以运用在对象拷贝上面，JSON.stringify也可以进行对象的深拷贝，但它有很多弊端，不建议使用[JSON.stringify深拷贝的弊端](https://www.jianshu.com/p/52db1d0c1780)


