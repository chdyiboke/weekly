# JSX

JSX是一个可嵌入的类XML语法。虽然转换语义要依据不同实现，但这也意味着它能被解析成有效的js代码。JSX随着React框架而流行起来，但现在也看到了其他实现。TypeScript支持嵌入、类型检查以及将JSX直接编译成JavaScript。

- [JSX](#jsx)
  - [基础用法](#基础用法)
  - [as操作符](#as操作符)
  - [类型检查](#类型检查)
  - [固有元素](#固有元素)
  - [基于值的元素](#基于值的元素)
  - [函数组件](#函数组件)
  - [类组件](#类组件)
  - [属性类型检查](#属性类型检查)
  - [后代类型检查](#后代类型检查)
  - [JSX结果类型](#jsx结果类型)
  - [嵌入表达式](#嵌入表达式)
  - [React 集合](#react-集合)
  - [配置 JSX](#配置-jsx)

## 基础用法
为了使用JSX，你必须做两件事。
1. 命名你的文件以 `.tsx` 后缀
2. 开启`jsx` 配置项

TypeScript 具有三种模式: `preserve`, `react`, 和 `react-native`。这些模式只会在代码生成阶段起作用 - 类型检查不会受到影响。 `preserve` 模式将JSX作为输出，以供后续的转换工具进一步使用 (比如 [Babel](https://babeljs.io/)). 另外输出的文件将以`jsx`为文件后缀。 `react` 模式将会触发 `React.createElement`, 在使用之前不需要进行jsx转换,输出将会以 `.js` 为文件后缀。 `react-native` 模式和 `preserve`模式类似，但是输出文件是以 `.js` 为文件后缀。

模式|输入|输出|输出文件后缀
---|:--:|---:|---:
preserve|\<div />|\<div />|.jsx
react|\<div />|React.createElement("div")|.js
react-native|\<div />|\<div />|.js
react-jsx|\<div />|_jsx("div", {}, void 0);|.js
react-jsxdev|\<div />|_jsxDEV("div", {}, void 0, false, {...}, this);|.js

你能指定模式：既可以使 `--jsx` 命令行标识；也可以在你的 [tsconfig.json](https://www.typescriptlang.org/tsconfig#jsx)文件中开启相应的配置。
  >提示: 当设定react JSX触发阶段开启--jsxFactory选项时，你能指定jsx工厂函数去使用 (默认为 React.createElement)
## as操作符

回忆一下如何写类型断言:
```TS
  var foo = <foo>bar;
```
这个断言变量 `bar` 的类型是 `foo` 。因为TypeScript也使用尖括号来表示类型断言，所以将它与JSX的语法结合起来会带来一些解析困难。因此， 在 `.tsx` 文件中TypeScript 不允许使用尖括号进行类型断言。

因为上面的语法不能用在 `.tsx` 文件中, 因此我们应该使用: as。 这个例子可以很容易的使用 `as` 操作符来重写。
```TS
  var foo = bar as foo;
```

as操作符在`.ts` 和 `.tsx` 中都可以被使用，和使用尖括号类型断言效果相同。

## 类型检查

为了理解使用JSX的类型检查，您必须首先理解内部元素和基于值的元素之间的区别。给定JSX表达式`<expr />`， `expr`可能引用环境自带的某些东西(例如DOM环境中的` div`或`span`)，也可以引用你创建的自定义组件。这很重要，有两个原因:
1. 对于React，固有元素以字符串的形式生成(`React.createElement("div") `)，而你创建的组件则不会(` React.createElement(MyComponent `))。
2. 传入JSX元素中的属性类型查找的方式是不同的。固有元素属性本身就支持，然而自定义的组件会自己去指定它们具有哪个属性。

TypeScript使用[与React相同的规范](http://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components)来区分它们。固有元素总是以小写字母开头，而基于值的元素总是以大写字母开头。


## 固有元素

固有元素使用特殊的接口`JSX.IntrinsicElements`来查找。 默认情况下，如果未指定此接口，则会执行任何操作，并且不会检查固有元素。但是，如果存在这个接口，那么固有元素的名称需要在`JSX.IntrinsicElements`接口的属性里查找。 例如：

```TS
  declare namespace JSX {
    interface IntrinsicElements {
      foo: any;
    }
  }
  <foo />; // ok
  <bar />; // error
```
在上面的例子中，`<foo />`可以正常工作，但`<bar />`将会报错，这是由于它没有被`JSX.IntrinsicElements`指定。
  >提示: 你能够在JSX.IntrinsicElements上指定一个用来捕获所有字符串索引:
```TS
  declare namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
```
## 基于值的元素

基于值的元素会简单的在它所在的作用域里按标识符查找。
```TS
  import MyComponent from "./myComponent";
  <MyComponent />; // ok
  <SomeOtherComponent />; // error
```
定义基于值的元素有两种方法:
1. 函数组件 (FC)
2. 类组件

由于这两种基于值的元素在JSX表达式中无法区分，所以TS首先尝试使用重载解析将表达式解析为函数组件。如果这个过程成功，TS就完成表达式的声明解析。如果该值不能作为函数组件解析，TS将尝试将其作为类组件解析。如果失败，TS将报告一个错误。

## 函数组件

顾名思义，这个组件被定义为js函数，其第一个参数是props对象。TS强制其返回类型必须可分配给 `JSX.Element`.
```TS
  interface FooProp {
    name: string;
    X: number;
    Y: number;
  }
  declare function AnotherComponent(prop: { name: string });
  function ComponentFoo(prop: FooProp) {
    return <AnotherComponent name={prop.name} />;
  }
  const Button = (prop: { value: string }, context: { color: string }) => (
    <button />
  );
```

因为函数组件只是一个JavaScript函数，所以这里也可以使用函数重载:
```TS
  interface ClickableProps {
    children: JSX.Element[] | JSX.Element
  }
  interface HomeProps extends ClickableProps {
    home: JSX.Element;
  }
  interface SideProps extends ClickableProps {
    side: JSX.Element | string;
  }
  function MainButton(prop: HomeProps): JSX.Element;
  function MainButton(prop: SideProps): JSX.Element {
    ...
  }
```

  >提示: 函数组件以前是作为无状态函数组件而被熟知 (SFC).由于在新版本的React中，函数组件不再被认为是无状态的，所以类型  `SFC` 和它的别名 `StatelessComponent` 被废弃。
## 类组件
我们可以定义类组件的类型。但是，最好理解两个新术语:元素类的类型和元素实例的类型。

给定 `<Expr />`，元素类的类型是Expr类型。在上面的示例中，如果`MyComponent`是ES6的类，那么类类型就是类的构造函数和静态部分。 如果`MyComponent`是个工厂函数，类类型为那个函数。

一旦建立了类类型，实例类型就由类的构造器或调用签名的返回类型的联合构成。因此，在ES6类的情况下，实例类型将是该类实例的类型，在工厂函数的情况下，它将是函数返回值的类型。

```TS
  class MyComponent {
    render() {}
  }
  // use a construct signature
  var myComponent = new MyComponent();
  // element class type => MyComponent
  // element instance type => { render: () => void }
  function MyFactoryFunction() {
    return {
      render: () => {},
    };
  }
  // use a call signature
  var myComponent = MyFactoryFunction();
  // element class type => FactoryFunction
  // element instance type => { render: () => void }
```

元素的实例类型很有趣，因为它必须赋值给`JSX.ElementClass`或抛出一个错误。 默认的`JSX.ElementClass`为{}，但是它可以被扩展用来限制JSX的类型以符合相应的接口。

```TS
  declare namespace JSX {
    interface ElementClass {
      render: any;
    }
  }
  class MyComponent {
    render() {}
  }
  function MyFactoryFunction() {
    return { render: () => {} };
  }
  <MyComponent />; // ok
  <MyFactoryFunction />; // ok
  class NotAValidComponent {}
  function NotAValidFactoryFunction() {
    return {};
  }
  <NotAValidComponent />; // error
  <NotAValidFactoryFunction />; // error
```

## 属性类型检查
属性类型检查的第一步是确定元素属性类型。 这在固有元素和基于值的元素之间略有不同。

对于固有元素来说，这是 `JSX.IntrinsicElements` 属性的类型
```TS
  declare namespace JSX {
    interface IntrinsicElements {
      foo: { bar?: boolean };
    }
  }
  // element attributes type for 'foo' is '{bar?: boolean}'
  <foo bar />;
```
对于基于值的元素来说，会有一点儿复杂。 它取决于先前确定的在元素实例类型上的某个属性的类型。 至于该使用哪个属性来确定类型取决于`JSX.ElementAttributesProperty`。 它应该使用单一的属性来定义。 这个属性名之后会被使用。 比如在TypeScript 2.8，如果未指定`JSX.ElementAttributesProperty`，那么将使用类元素构造函数或函数组件调用的第一个参数的类型。
```TS
  declare namespace JSX {
    interface ElementAttributesProperty {
      props; // specify the property name to use
    }
  }
  class MyComponent {
    // specify the property on the element instance type
    props: {
      foo?: string;
    };
  }
  // element attributes type for 'MyComponent' is '{foo?: string}'
  <MyComponent foo="bar" />;
```

元素属性类型用于对JSX中的属性进行类型检查。支持可选和必需的属性。
```TS
  declare namespace JSX {
    interface IntrinsicElements {
      foo: { requiredProp: string; optionalProp?: number };
    }
  }
  <foo requiredProp="bar" />; // ok
  <foo requiredProp="bar" optionalProp={0} />; // ok
  <foo />; // error, requiredProp is missing
  <foo requiredProp={0} />; // error, requiredProp should be a string
  <foo requiredProp="bar" unknownProp />; // error, unknownProp does not exist
  <foo requiredProp="bar" some-unknown-prop />; // ok, because 'some-unknown-prop' is not a valid identifier
```

  >提示: 如果一个属性名不是一个合法的JS标识符(像一个 `data-*`属性)，如果它没有在元素属性类型中被发现，那么这并不会被当作是一个错误。
另外，在jsx结构里`JSX.IntrinsicAttributes`接口可以被用来指定额外的属性使用，这些额外的属性通常不会被组件的props或arguments使用 - 比如React里的`key`。进一步讲，泛型 `JSX.IntrinsicClassAttributes<T>`类型还可以用来为类组件(而不是函数组件)指定相同类型的额外属性。在此类型中，泛型参数对应于类实例类型。在React，它用来允许 `Ref<T>`类型上的`ref`属性。 通常来讲，这些接口上的所有属性都是可选的，除非你想要用户在每个JSX标签上都提供一些属性。

延展操作符也可以这样用:
```TS
  var props = { requiredProp: "bar" };
  <foo {...props} />; // ok
  var badProps = {};
  <foo {...badProps} />; // error
```

## 后代类型检查

在TypeScript 2.3之后，TS引入了对children的类型检查。children是元素属性类型中的一个特殊属性，其中子JSXExpression被插入到属性中。类似于TS如何使用`JSX.ElementAttributesProperty`。为了确定属性的名称，TS使用 `JSX.ElementChildrenAttribute`来确定这些属性中的子元素的名称。`JSX.ElementChildrenAttribute`应该用单个属性声明。

```TS
  declare namespace JSX {
    interface ElementChildrenAttribute {
      children: {}; // specify children name to use
    }
  }
```

```TS
    <div>
      <h1>Hello</h1>
    </div>;
    <div>
      <h1>Hello</h1>
      World
    </div>;
    const CustomComp = (props) => <div>{props.children}</div>
    <CustomComp>
      <div>Hello World</div>
      {"This is just a JS expression..." + 1000}
    </CustomComp>
```

你能够像定义其他属性一样指定它的后代类型。如果你这样做的话，这会覆盖默认类型，如 在[React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)中定义的。

```TS
  interface PropsType {
    children: JSX.Element
    name: string
  }
  class Component extends React.Component<PropsType, {}> {
    render() {
      return (
        <h2>
          {this.props.children}
        </h2>
      )
    }
  }
  // OK
  <Component name="foo">
    <h1>Hello World</h1>
  </Component>
  // Error: children is of type JSX.Element not array of JSX.Element
  <Component name="bar">
    <h1>Hello World</h1>
    <h2>Hello World</h2>
  </Component>
  // Error: children is of type JSX.Element not array of JSX.Element or string.
  <Component name="baz">
    <h1>Hello</h1>
    World
  </Component>
```

## JSX结果类型

默认情况下，JSX表达式的结果类型为`any`。你能自定义这个类型通过声明 `JSX.Element` 接口。但是，不能够通过这个接口检索元素、属性或JSX的子元素的类型信息。它是一个黑盒。

## 嵌入表达式

JSX允许在标记之间嵌入表达式，方法是在表达式周围加上花括号 (`{ }`).
```TS
  var a = (
    <div>
      {["foo", "bar"].map((i) => (
        <span>{i / 2}</span>
      ))}
    </div>
  );
```

上面的代码会产生一个错误，因为你不能把一个字符串除以一个数字。使用`preserve`选项时，输出如下所示：

```TS
  var a = (
    <div>
      {["foo", "bar"].map(function (i) {
        return <span>{i / 2}</span>;
      })}
    </div>
  );
```

## React 集合
使用React的JSX应该使用[React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react). 这些类型声明定义了 `JSX` 命名空间，以便与React一起使用。

```TS
  /// <reference path="react.d.ts" />
  interface Props {
    foo: string;
  }
  class MyComponent extends React.Component<Props, {}> {
    render() {
      return <span>{this.props.foo}</span>;
    }
  }
  <MyComponent foo="bar" />; // ok
  <MyComponent foo={0} />; // error
```

## 配置 JSX
有多个编译器标记可以用于定制您的JSX，它们既可以作为编译器标记，也可以通过内联的每个文件标注来工作。要了解更多信息，请查看他们的tsconfig参考页面：
* [jsxFactory](https://www.typescriptlang.org/tsconfig/#jsxFactory)
* [jsxFragmentFactory](https://www.typescriptlang.org/tsconfig/#jsxFragmentFactory)
* [jsxImportSource](https://www.typescriptlang.org/tsconfig/#jsxImportSource)
