# 引言

react样式实现方式有很多种：Inline styling、Styled Components、CSS Modules等。最近项目开发用到了Styled Components，但对CSS Modules有一些陌生（没用过），同时也了解下react-css-modules的使用。

## Inline styling

Inline styling内联样式比较简单，CSS属性放在双大括号之间{{ }}，第一对大括号正是将JS表达式放入JSX解析，里面的那对大括号则创建了一个style对象实例，所以在这里style是作为一个对象传入组件。

```javascript
<div style={{ backgroundColor: "#44014C", width: "300px", minHeight: "200px"}}>
```

需要注意的是，因为在这里style是一个对象，所以其中的属性之间是用逗号分隔的。另外，因为这是js对象属性，所以属性使用驼峰命名，而不用横线。

但是当组件需要更复杂的样式时，内联的方式不太好看，可以创建一个style对象变量，然后传入组件，在组件中直接引用。

## Styled Components

styled-components 是 CSS in JS 其中教热门的一种方法。CSS-in-JS就是将应用的CSS样式写在JavaScript文件里面，而不是独立为一些css\scss\less之类的文件，这样你就可以在CSS中使用一些属于JS的变量定义、条件判断等语言特性来提供灵活的可扩展的样式定义。

使用styled-components，意味着可以真正的在js里写css代码，特别是媒体查询、伪类选择等，styled-component使用的是ES6的标签模板字符串语法（Tagged Templates）,使用styled-components，组件和样式之间的映射将被移除，这意味着当你在写样式代码的时候，你其实正在创建一个拥有这部分样式的组件，通过styled components, 我们可以创建一个可复用的具有样式的组件，具体实现方法如下。
```javascript
import styled from 'styled-components';

const Label = styled.span`
  font-size: 14px;
  line-height: 32px;
  margin-right: 12px;
`;

<Label>猫眼id:</Label>
<Label>综艺名字:</Label>
```
这个例子创建了一个名为Label的可复用组件，但希望在使用的同时，希望避免过度组件化，毕竟代码的可读性教差。

## CSS-Modules

开发react项目发现和vue项目样式不太一样，在vue里可以用scoped编写局部样式，但是react并没有提供这个关键字，CSS Modules可以很好的解决这个问题（CSS变量名冲突）。

一个CSS模块指一个CSS文件，在CSS文件汇总，所有的类名和动画名称都会被限制在当前文件中，即只对当前文件有效果。CSS模块的目的是希望通过将CSS类与类之间相互隔离，防止造成命名冲突。

一个CSS模块实际上是一个编译过的.css文件。编译结束后我们将得到两个结果，其中一个是对类名加注版本号的CSS的文件，另一个则是一个将新类名与原始类名对应起来的js对象。例如CSS Modules将本地名.button编译成全局名.button_***，生成的js对象如下：
```css
{
    button: button_***
}
```
使用方法：

```js
// styles.css文件
.button {
    color: red;
    font-size: 16px;
} 
```
```js
//文件中引用样式
import styles from './styles.css';

<button className = {styles.button}>I am an error message</button> 
```
如果想要定义全局的样式，使用':global',表示该类为全局作用域下的

使用CSS-Modules也有一定的缺点：

* 当引入到 className 中时必须要使用 styles
* CSS modules 和 全局css类混合在一起会很难管理
* 引用没用定义的CSS modules不会出现警告

使用react-css-modules将解决上面css modules的问题

## react-css-modules

```js
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './table.css';

class Table extends React.Component {
    render () {
        return <div className="table">
            <div styleName='row'>
                <div styleName='cell'>A0</div>
                <div styleName='cell'>B0</div>
            </div>
        </div>;
    }
}

export default CSSModules(Table, styles);
```

在此示例中，CSSModules用于Table使用./table.css CSS模块装饰组件。当Table组件被呈现时，它将使用的属性styles的对象，以构建className值。而且全局CSS（className）和局部CSS（styleName）之间有明显的区别。

### styleName不能用来修饰子组件的样式

```js
import React from 'react';
import CSSModules from 'react-css-modules';
import List from './List';
import styles from './table.css';
 
class CustomList extends React.Component {
    render () {
        let itemTemplate;
        // 使用styleName 来修饰CustomList组件的子组件List
        // 这是不允许的
        itemTemplate = (name) => {
            return <li styleName='item-template'>{name}</li>;
        };
 
        return <List itemTemplate={itemTemplate} />;
    }
}

export default CSSModules(CustomList, styles);
```

解决办法：
1. 将styles当作属性传给子组件或者
```js
// 使用styles属性，从父组件传递下去即可
itemTemplate = (name) => {
    return <li className={this.props.styles['item-template']}>{name}</li>;
};
```
2. 在父组件内部调用CSSModules， 对子组件进行修饰
```js
itemTemplate = (name) => {
      return <li styleName="item-template">{name}</li>;
};
// 内部调用CSSModules    
itemTemplate = CSSModules(itemTemplate, this.props.styles);
```
### CSSModules选项
CSSModules有2种写法：
1. CSSModules(Component, styles, options)
2. CSSModules(Component, styles)

其中options:
allowMultiple: 默认false, 表示是否可以声明多个类
```js
<div styleName='foo bar' /> // 不允许则报错
```
errorWhenNotFount: 默认true, 表示如果styleName在 css modules中没有找到则会报错

### 对于选择性的类名使用styles属性
styleName='foo' 和 className={this.props.styles.foo} 是同等的
```js
// 先声明这个变量
let visible = this.props.showMsg ? 'msg-visible' : 'msg-hidden';

// 然后在这用className来代替styleName，由于visible存在-,这里采用[]的方式
<div className={this.props.styles[visible]} >      
...
</div>
```

# 总结和疑问

React样式实现方式有很多种，各有各的优缺点，例如styled-components可以在js写入css，提供灵魂的可扩展性的样式定义，但可读性较差。具体用哪种方法实现视项目而定。

目前的项目在引入样式文件时，会把每个文件的样式都包含在一个属性下面，避免代码冗余，貌似很少的项目使用CSS-Modules,为什么呢？（仅仅因为代码编写起来和正常的样式引用不太一致？）
