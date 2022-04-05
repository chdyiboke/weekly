# 为什么transform对行内元素不生效


## 为什么会发现这个问题？

栗子：
```
<div class="box">
  <span>今天你吃了么？</span>
</div>

// css
span {
  transform: translateX(20px)
}

```
然而span标签并没有向右移动20px？

但当我给span增加display: inline-block时，transform又表现正常了——span向右位移了20px。

图标旋转的时候，发现的！！！
## transform不支持行内元素么？

css3-transform-not-working
https://stackoverflow.com/questions/4919963/css3-transform-not-working

其中一个回答引用了w3c关于transform的规范：


```
CSS Transforms Module Level 1 - Transformable Element
A transformable element is an element in one of these categories:
an element whose layout is governed by the CSS box model which is either a block-level or atomic inline-level element, or whose display property computes to table-row, table-row-group, table-header-group, table-footer-group, table-cell, or table-caption [CSS2]
an element in the SVG namespace and not governed by the CSS box model which has the attributes transform, patternTransform or gradientTransform [SVG11].

```

上面说到能够transform的元素有哪些。其中提到atomic inline-level element(原子行内级元素，嗯，翻译就是如此蹩脚)，难不成span、a等行内元素不属于原子行内级元素？


```
两个盒子：inline box(行内盒子)和inline-level box(行内级盒子)：

行内盒子由一个display: inline的非替换元素生成。
行内级盒子又叫做原子行内级盒子，它不是 行内盒子。因为它是透明的。
```
## 结论
因为，

```
display: block: 让一个元素生成一个block box
display: inline-block: 生成一个inline-level block container，元素本身被格式化为atomic inline-level box，它的内部被格式化为block box
display: inline: 让一个元素生成一个或多个inline boxes【span】

而，可被transform的元素有：block-level elementoratomic inline-level elementetc，但不包括inline element.

```
