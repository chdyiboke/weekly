# React key的正确用法

react利用key来识别组件，它是一种身份标识标识，就像我们的身份证用来辨识一个人一样。

## Not using a key

bad
```
import React from "react";

export const ShoppingList = () => {
  const shoppingListItems = ["milk", "eggs", "bread", "cheese", "juice"];

  return (
    <ul>
      {shoppingListItems.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
};

```

Error message when forgetting to add a key


good

```
import React from "react";

export const ShoppingList = () => {
  const shoppingListItems = ["milk", "eggs", "bread", "cheese", "juice"];

  return (
    <ul>
      {shoppingListItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

```

## Adding the key in the wrong place

bad
```
import React from "react";

const ShoppingListItem = ({ item }) => <li key={item}>{item}</li>;

export const ShoppingList = () => {
  const shoppingListItems = ["milk", "eggs", "bread", "cheese", "juice"];

  return (
    <ul>
      {shoppingListItems.map((item) => (
        <ShoppingListItem item={item} />
      ))}
    </ul>
  );
};
```

good

```
import React from "react";

const ShoppingListItem = ({ item }) => <li>{item}</li>;

export const ShoppingList = () => {
  const shoppingListItems = ["milk", "eggs", "bread", "cheese", "juice"];

  return (
    <ul>
      {shoppingListItems.map((item) => (
        <ShoppingListItem item={item} key={item} />
      ))}
    </ul>
  );
};

```


## 不使用稳定的标识符作为键，尤其是在使用动态列表时

bad

```
import React, { useState, Fragment } from "react";

export const Classmates = () => {
  const [sortAToZ, setSortAToZ] = useState(true);

  const classmates = ["Trevor", "John", "Adam", "Tyler", "Matt", "Tyler"];
  const sortedClassmates =
  sortAToZ
      ? [...classmates].sort()
      : [...classmates].sort().reverse();

  const reverseSortOrder = () => setSortAToZ(sortAToZ => !sortAToZ)

  return (
    <Fragment>
      <button onClick={reverseSortOrder}>Reverse Sort Order</button>
      <ul>
        {sortedClassmates.map((classmate, index) => (
          <li key={index}>
            <label>
              <input type="checkbox" /> {classmate}
            </label>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};
```

![这是图片](https://res.cloudinary.com/practicaldev/image/fetch/s--AOm0wXor--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/i92v6bon13c90fyzzqyd.gif)

good

```
import React, { useState, Fragment } from "react";

export const Classmates = () => {
  const [sortAToZ, setSortAToZ] = useState(true);

  const sortAlphabetically = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  };

  const classmates = [
    { name: "Trevor", id: "a1b2c3" },
    { name: "John", id: "b2c3d4" },
    { name: "Adam", id: "c3d4e5" },
    { name: "Tyler", id: "d4e5f6" },
    { name: "Matt", id: "e5f6g7" },
    { name: "Tyler", id: "f6g7h8" }
  ];
  const sortedClassmates = sortAToZ
    ? [...classmates].sort(sortAlphabetically)
    : [...classmates].sort(sortAlphabetically).reverse();

  const reverseSortOrder = () => setSortAToZ((sortAToZ) => !sortAToZ);

  return (
    <Fragment>
      <button onClick={reverseSortOrder}>Reverse Sort Order</button>
      <ul>
        {sortedClassmates.map((classmate) => (
          <li key={classmate.id}>
            <label>
              <input type="checkbox" /> {classmate.name}
            </label>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

```

例子一： 
不涉及到数组的动态变更，其实是可以使用index作为key的。  
例如，如果我们的列表可以排序或过滤，那么在使用索引作为键时，我们会遇到一些问题。

例子二： 
antd 的list 分页时。里面有 checkbox 的时候也遇到了这种情况。  
给 checkbox checked 赋值才好使的。


key值的唯一是有范围的，即在数组生成的同级同类型的组件上要保持唯一，而不是所有组件的key都要保持唯一


## React 启发式的算法，来优化一致性的操作

启发式算法指人在解决问题时所采取的一种根据经验规则进行发现的方法。其特点是在解决问题时,利用过去的经验,选择已经行之有效的方法，而不是系统地、以确定的步骤去寻求答案。


1. 不同的两个元素会产生不同的树
2. 可以使用key属性来表明不同的渲染中哪些元素是相同的

```
//li元素是数组生成的，下面只是表示元素树，并不代表实际代码
//old tree
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

//new tree
<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

```

　　React在比较第一个li就发现了差异，如果React将第一个li中的内容进行更新，那么你会发现第二个li不同 也需要将li中内容进行更新，并且第三个<li>需要安装新的元素，但事实真的是如此吗？其实不然，我们发现新的元素树和旧的元素树，只有第一项是不同的，后两项其实并没有发生改变，如果React懂得在旧的元素树开始出插入li，那么性能会极大的提高，关键问题是React如何进行这种判别，这时React就用到了key属性。



