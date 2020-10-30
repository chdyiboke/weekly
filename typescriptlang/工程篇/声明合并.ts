// 声明合并：多个重名的声明，合并到一起



// 【接口】的声明合并，字符串自变量提升至顶端
interface A{
    x: number;
    // y: string;  类型不同会报错
    foo(bar: number): number; // 3
}

interface A{
    y: number;
    foo(bar: number): number; // 1
    foo(bar: string): string; // 2
}


let asm: A = {x:1,y:2,foo(bar: any){
    return bar
}}; // 


// 【命名空间】的声明合并，可以和函数、类、枚举进行合并。
// 命名空间需要放到后面，否则提示报错，枚举除外。

class C {}
namespace C {
    export let state = 1
}
console.log(C.state)

// 重名并不是一个好的模式，尽量避免

