// 命名空间 的实现原理

namespace Shape {
    export function square(x: number){
        return x*x;
    }
}
Shape.square(2);


// 要点

// 本质上是个闭包，更多是对全局模块的兼容，可以不使用啦。
