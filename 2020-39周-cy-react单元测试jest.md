# react 单元测试 jest

测试主要有三个类型：

1. 单元测试
2. 集成测试
3. UI 测试

Jest 是单元测试

## 快速入门

[快速入门](https://jestjs.io/docs/en/getting-started)

```
npm i jest --save-dev
```

可以使用 jest 命令运行 test。

```
Jest将使用以下任何流行的命名约定查找测试文件：

文件夹中带有.js后缀的__tests__文件。
带.test.js后缀的文件。
带.spec.js后缀的文件。
```

建议将测试文件（或**tests**文件夹）放在要测试的代码旁边

```
function sum(a, b) {
  return a + b;
}
module.exports = sum;


const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

```

PASS ./sum.test.js  
✓ adds 1 + 2 to equal 3 (5ms)

### 使用 babel

Jest 是基于 Node 的运行器。也是 commonjs 规范， 使用 import 等 ES6 语法需要 babel 转换。

```
yarn add --dev babel-jest @babel/core @babel/preset-env

// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};

```

## 基本配置及语法

### 配置--零配置

Jest 的配置可以在 package.json 项目的文件中定义，也可以通过 jest.config.js 文件或--config

```
module.exports = {
  verbose: true,
  collectCoverage: true,
};
```

具体配置见[官网](https://jestjs.io/docs/en/configuration)。

```
module.exports = {
  setupFiles: [
    './test/setup.js',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testRegex: '.*\\.test\\.js$',
  collectCoverage: false,
  collectCoverageFrom: [
    'src/components/**/*.{js}',
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js"
  },
  transform: {
    "^.+\\.js$": "babel-jest"
  },
};


```

>

- setupFiles：配置文件，在运行测试案例代码之前，Jest 会先运行这里的配置文件来初始化指定的测试环境
- moduleFileExtensions：代表支持加载的文件名
- transform：用 babel-jest 来编译文件，生成 ES6/7 的语法

### 语法--使用匹配器

expect 是期望，断言  
toBe 用的是 JavaScript 中的 Object.is()

按照类型：

```
<!-- 普通匹配器 -->
it("test sum 尝试运行", () => {
  expect(1 + 1).toBe(2); // Pass
});

// toEquel递归检查对象或者数组中的每个字段
it("test toEqual 对象的深比较 常用", () => {
  expect({ aa: 1, bb: 2 }).toEqual({ aa: 1, bb: 2 });  // Pass
  //   expect({ aa: 1, bb: 2 }).toEqual({ aa: 1, cc: 2 });  // no Pass
});

<!-- 字符串 -->
test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});

```

### 语法--作用域

before 和 after 的块：顺序
describe： 分组

```
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));

describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach  //特别注意
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll

```

## 多种方法

1. 官方测试工具库
2. react create app 自动集成官方
3. Enzyme

### 官方测试工具库

1. Shallow Rendering：测试虚拟 DOM 的方法
2. DOM Rendering: 测试真实 DOM 的方法

测试工具类：`react-dom/test-utils`  
渲染方法：`react-test-renderer`

```
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
```

通过下面的 demo 来看应用，文档写的很赞

### react create app

#### 快照测试

```
    const button = create(<Button />);
    expect(button.toJSON()).toMatchSnapshot();
```

#### 错误的方式，测试 React 组件

```
  test("it shows the expected text when clicked (testing the wrong way!)", () => {
    const component = create(<Button text="SUBSCRIBE TO BASIC" />);
    const instance = component.getInstance();
    expect(instance.state.text).toBe("");
    instance.handleClick();
    expect(instance.state.text).toBe("PROCEED TO CHECKOUT");
  });
```

只是断言其内部状态，用户看到的不一定是测试那样。
https://zh-hans.reactjs.org/docs/test-renderer.html#testrenderergetinstance

#### 正确的方式，测试 React 组件

```
  test("it shows the expected text when clicked (testing the wrong way!)", () => {
    const component = create(<Button text="SUBSCRIBE TO BASIC" />);
    // 在测试中使用root而不是getInstance()。根据文档，testRenderer.root“返回根测试实例对象，该对象对于对树中的特定节点进行断言很有用”
    const instance = component.root;
    const button = instance.findByType("button");
    button.props.onClick();
    // button.props.children
    expect(button.props.children).toBe("PROCEED TO CHECKOUT");
  });
```

永远记住：不要测试实现。

#### React 钩子插曲：Act API

之前的测试不适用于 React 钩子。事实证明，需要为 React 使用一个新的测试 API，称为 Act。

```
  test("it shows the expected text when clicked", () => {
    let component;
    act(() => {
      component = create(<Button text="SUBSCRIBE TO BASIC" />);
    });
    const instance = component.root;
    const button = instance.findByType("button");
    act(() => button.props.onClick());
    expect(button.props.children).toBe("PROCEED TO CHECKOUT");
  });
```

#### 真实 DOM 的 API

如果可以与 DOM 交互，测试会更加真实。

```
let container;

beforeEach(() => {
  // 初始化一个最小的DOM结构
  container = document.createElement("div");
  document.body.appendChild(container);
});

  test("it shows the expected text when clicked", () => {
    act(() => {
      ReactDOM.render(<Button text="SUBSCRIBE TO BASIC" />, container);
    });
    // DOM上声明：
    const button = container.getElementsByTagName("button")[0];
    expect(button.textContent).toBe("SUBSCRIBE TO BASIC");
    act(() => {
      // 注意：button.dispatchEvent即使调用不包装在act中，它仍然有效。
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(button.textContent).toBe("PROCEED TO CHECKOUT");
  });

```

#### 用 Jest 模拟 Fetch API 调用

在大多数情况下，在测试期间没有理由调用外部API。

Mock响应模拟API： jest.spyOn(object, methodName).mockImplementation(() => customImplementation)
```
let container;

beforeEach(() => {
  // 初始化一个最小的DOM结构
  container = document.createElement("div");
  document.body.appendChild(container);
});


  test("it shows a list of users", async () => {
    const fakeResponse = [{ name: "John Doe" }, { name: "Kevin Mitnick" }];

    jest.spyOn(window, "fetch").mockImplementation(() => {
      const fetchResponse = {
        // 使用名为json的函数创建了一个新的 响应对象
        json: () => Promise.resolve(fakeResponse)
      };
      return Promise.resolve(fetchResponse);
    });

    await act(async () => {
      render(<Users />, container);
    });

    expect(container.textContent).toBe("John DoeKevin Mitnick");

    window.fetch.mockRestore();
  });
```

### Enzyme

官方测试工具库的封装，它模拟了jQuery的API，非常直观，易于使用和学习。
它提供三种测试方法。

* shallow：虚拟 DOM
* render：静态的HTML字符
* mount： 真实DOM节点

新建 jest.config.js(同上)  
新建 setupTests.js

```
<!-- setupTests.js -->

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

```

测试框架 Mocha，[Mocha 教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)

```
import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import App from '../app/components/App';
<!-- 应用标题应为"Todos" -->
describe('Enzyme Shallow', function () {
  it('App\'s title should be Todos', function () {
    let app = shallow(<App/>);
    expect(app.find('h1').text()).to.equal('Todos');
  });
});

<!-- Todo项的初始状态（"未完成"或"已完成"）应该正确 -->
describe('Enzyme Render', function () {
  it('Todo item should not have todo-done class', function () {
    let app = render(<App/>);
    expect(app.find('.todo-done').length).to.equal(0);
  });
});

<!-- 点击添加按钮，会新增一个Todo项 -->
  it('Turning a Todo item into Done', function () {
    let app = mount(<App/>);
    let todoItem = app.find('.todo-text').at(0);
    todoItem.simulate('click');
    expect(todoItem.hasClass('todo-done')).to.equal(true);
  });
});

```
## 参考

《Testing React Components: The Mostly Definitive Guide》 ：https://www.valentinog.com/blog/testing-react/
阮一峰 react 测试入门教程： http://www.ruanyifeng.com/blog/2016/02/react-testing-tutorial.html
Next.js 项目单元测试的配置（Jest+Enzyme）: https://juejin.im/post/6844904111184281608
react 官网测试指南：https://reactjs.org/docs/test-utils.html
Jest 进行 React 单元测试详情: https://juejin.im/post/6844903654294716423
