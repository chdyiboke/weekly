# 2021-31周webassembly（rust 编译）


[中文官网: www.rust-lang.org/zh-CN](https://www.rust-lang.org/zh-CN/what/wasm)

# Why Rust?
## WebAssembly支持多种语言
目前能编译成 WebAssembly 字节码的高级语言有：
AssemblyScript:语法和 TypeScript 一致，对前端来说学习成本低，为前端编写 WebAssembly 最佳选择；
c\c++:官方推荐的方式。
Rust:语法复杂、学习成本高，对前端来说可能会不适应。
Kotlin:语法和 Java、JS 相似，语言学习成本低。
Golang:语法简单学习成本低。但对 WebAssembly 的支持还处于未正式发布阶段。

## Why Rust?

1. 可预见的性能
没有难以预料的 GC 暂停，也没有 JIT 编译器造成性能抖动，只有底层控制与上层人体工程学的完美结合。

2. 更小的代码尺寸
代码尺寸越小，页面加载速度就越快。Rust 生成的 .wasm 模块不含类似于垃圾回收器这样的额外成本。高级优化和 Tree Shaking 优化可移除无用代码。

3. 现代设施，社区友好
充满活力的库生态系统助您旗开得胜。Rust 拥有丰富的表达能力和零成本的抽象，以及助力您学习的友好社区。


# 开发环境搭建，

在线（https://webassembly.studio/）, 貌似很难用

安装Rust
移步到 https://www.rust-lang.org/tools/install 哦~

安装 wasm-pack
```
cargo install wasm-pack
```

## 新建 Rust 项目，本文以斐波那契数列为例


```
cargo new --lib hello-wasm-fibonacci
创建成功后提示： Created library hello-wasm-fibonacci package

```

配置Cargo.toml

```
[package]
name = "hello-wasm"
version = "0.1.0"
authors = ["Your Name <you@example.com>"]
description = "A sample project with wasm-pack"
license = "MIT/Apache-2.0"
repository = "https://github.com/yourgithubusername/hello-wasm"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"

```

开始写 Rust 代码【终于】
```
extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

//生成 n 阶斐波那契数列
fn fibonacci(n: u32) -> u32 {
    if n == 0 {
        return 0;
    } else if n == 1 {
        return 1;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

#[wasm_bindgen]
pub fn get_fibonacci(n: u32) -> u32 {
    return fibonacci(n);
}


```

js 调用
```
const fibonacci = import("./node_modules/@yournpmusername/hello-wasm-fibonacci/hello_wasm_fibonacci.js");

fibonacci.then(fibonacci => {
  const a = fibonacci.get_fibonacci(10)
  console.log(a)
});

```



## 参考
https://juejin.cn/post/6844904157950771208


