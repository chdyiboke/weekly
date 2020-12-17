# getComputedStyle与currentStyle获取样式

DOM标准里有个全局方法 <font color="#dd0000">getComputedStyle</font>，可以获取到当前对象样式规则信息，如：getComputedStyle(obj,null).paddingLeft，就能获取到对象的左内边距。但是事情还没完，万恶的IE不支持此方法，它有自己的一个实现方式，那就是currentStyle

```
function getStyle(obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr];
  } else {
    return getComputedStyle(obj, null)[attr];
  }
}
```


## 参考

https://segmentfault.com/a/1190000007477785

Compute：计算  
current：现在的，当前的
