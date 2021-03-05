# React中ref的使用

## 引言
现在我们和DOM直接打交道的机会少的多了，但在部分场景下仍然不可避免，比如输入框的聚焦、滚动、文本选择以及动画等场景。

在React中我们有ref、createRef以及本文的useRef三兄弟（指useRef、forwardRef以及useImperativeHandle），来使得我们能够在某些无法避免的场景下方便的操作dom。

## 引入问题
父组件如何获取到子组件方法：

* 用useRef三兄弟，将子组件的方法暴露出去，父组件通过ref进行调用，如ref.current.validate()

待配置的函数项（每一个函数都需要依次进行配置）与用户配置中存在的自定义配置项都是不确定的，由于hooks的原则（不要在循环中使用hooks），我们不能根据函数以及配置项数量动态的调用useRef生成ref：

* 那就用一个ref就行，所有的方法都挂载到这个ref上

ref在多次写入的情况下，上面的current属性会被覆盖，即使是不同的键名：

* 自己封装一个hook，允许每次写入current时进行值的合并


## useRef
在React的Class组件时期，我们通过createRef创建ref，看看官网的示例：

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  render() {
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }
}
```

但是，ref不能被分配给一个函数式组件（除非使用forwardRef，详见下一部分），因为函数式组件没有实例。

在函数式组件中，我们这样使用ref（注意，“在函数组件中使用ref” !== “将ref分配给函数式组件”）
```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

createRef和useRef的重要区别是createRef不能用在函数式组件中，而useRef不能用在Class组件中，前者的不能指的是 在函数式组件中使用createRef创建的ref，其值会随着函数式组件的重新执行而不断初始化，而后者的不能就比较简单了，hooks不能用在Class组件嘛。

useRef实际上还有一些奇技淫巧，由于它能够在组件的整个生命周期内保存current上的值，因此经常被用来解决一些闭包（参考Dan写的[这篇文章](https://overreacted.io/a-complete-guide-to-useeffect/)）与计时器问题，比如阿里开源的React Hooks库[ahooks](https://github.com/alibaba/hooks) 中就大量使用了useRef来保存计时器。

还有官方给的这个自定义hookusePrevious：
```js
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```
这个hooks可以拿到上一次的值，原理是useEffect会在每次渲染完毕后执行，所以ref的值在本次渲染过程永远会停留在上一次。

## forwardRef
ref不能被分配给函数式组件（无论这个ref是通过哪种方式创建的），准确的说应该是：ref不能被分配给没有给forwardRefd包裹的函数式组件。

使用方法：
```js
const App: React.FC = () => {
  const ref = useRef() as MutableRefObject<any>;

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <>
      <Child ref={ref} />
    </>
  );
};

const Child = forwardRef((props, ref: Ref<any>) => {
  return <input type="text" name="child" ref={ref} />;
});
```

forwardRef可以直接包裹一个函数式组件，被包裹的函数式组件会获得被分配给自己的ref（作为第二个参数）。

  如果你直接将ref分配给没有被forwardRef包裹的函数式组件，React会在控制台给出错误。

forwardRef的另一种使用场景是 高阶组件中转发refs，forwardRef通常是和useImperativeHandle一起使用，如果说forwardRef使得函数式组件拥有了让别人一窥芳容的能力，useImperativeHandle则就是她脸上的面纱：她可以随心所欲决定想让你看到什么。

## useImperativeHandle

在forwardRef例子中的代码实际上是不推荐的，因为无法控制要暴露给父组件的值，所以我们使用useImperativeHandle控制要将哪些东西暴露给父组件：

先来看看@types/react中的调用签名：
```js
function useImperativeHandle<T, R extends T>(ref: Ref<T>|undefined, init: () => R, deps?: DependencyList): void;
```

1. 接收一个ref
2. 接收一个函数，这个函数返回的对象即是要暴露出的ref
3. 类似useEffect，接收一个依赖数组

```js
onst App: React.FC = () => {
  const ref = useRef() as MutableRefObject<any>;

  useEffect(() => {
    ref.current.input.focus();
  }, []);

  return (
    <>
      <Child ref={ref} />
    </>
  );
};

const Child = forwardRef((props, ref: Ref<any>) => {
  const inputRef1 = useRef() as MutableRefObject<HTMLInputElement>;
  const inputRef2 = useRef() as MutableRefObject<HTMLInputElement>;

  useImperativeHandle(
    ref,
    () => {
      return {
        input: inputRef1.current,
      };
    },
    [inputRef1]
  );

  return (
    <>
      <input type="text" name="child1" ref={inputRef1} />
      <br />
      <input type="text" name="child2" ref={inputRef2} />
    </>
  );
});
```
在这个例子中，我们在Child组件内再次创建了两个ref，但我们只想暴露出第一个，因此使用useImperativeHandle来进行了控制。

useImperativeHandle的第一个参数表示你要操作的ref，第二个参数的返回值则是你要挂载在这个ref的current属性上的值。你可以理解为一根垂直管道，你在上方投入了什么，下方拿到的就是什么。最后一个参数则是在inputRef1变化时更新这个挂载。

useRef不一定要用来保存DOM或者Class组件，还可以用来保存计时器或是广义上的一个需要在生命周期内保持不变的值，同样的，那在使用useImperativeHandle时我们也不一定要返回ref，比如我们返回子组件内定义的方法

问题来了！！！

假设我们有一个列表，每个列表项都需要挂载一个方法，可能会这么写：
```js
{LIST.map((item, idx) => (
  <Item label={item} idx={idx} key={item} ref={globalRef} />
))}
```

每个列表项组件中都使用这个globalRef进行挂载子组件内部的方法。但是会发现只有最后一个列表项的方法被挂载上去了。

实际上，我们在前面也提到了这一点：一根垂直管道，你在上方投入了什么，下方拿到的就是什么， 我们始终只有一个globalRef，因此多次调用下最后一次的挂载覆盖掉了前面的。

那 如何在挂载时将已存在的值和本次挂载的值进行合并？

useImperativeHandle中我们会把init函数返回的对象挂载到初始ref的current属性上，返回什么就挂载什么。这也意味着我们是能拿到初始ref的current属性，那么就很简单了，直接把先前的current和本次的对象合并就好了：

```js
{
   ...originRef.current,
   ...convertRefObj,
};
```

修改后的源码：
```js
import { useImperativeHandle, MutableRefObject, DependencyList } from 'react';

const useMultiImperativeHandle = <T, K extends object>(
  originRef: MutableRefObject<T>,
  convertRefObj: K,
  deps?: DependencyList
): void =>
  useImperativeHandle(
    originRef,
    () => {
      return {
        ...originRef.current,
        ...convertRefObj,
      };
    },
    deps
  );

export default useMultiImperativeHandle;
```


## 参考链接
[useRef](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref)

[useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)

[useimperativehandle](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle)

[useMultiImperativeHandle](https://github.com/linbudu599/useMultiImperativeHandle)