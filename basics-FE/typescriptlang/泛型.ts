// 泛型 不确定数据类型。log<T> 可以用到接口中
// 背景  any 容易丢失类型

function log<T>(value: T): T {
    console.log(value);
    return value;
}

log<string[]>(['a', 'b']);
log(['a', 'b']);

// 泛型函数。
// 类型别名 type
// type Log = <T>(value: T)=>T;
// let mylog: Log = log;

// 泛型接口。
interface Log<T> {
    <T>(value: T): T;
}
// 实现时必须指定一个类型
let myLog: Log<number> = log;

// 泛型相当于是一个参数，参数是类型


// 泛型约束 
// 继承接口 ==》
class Log<T> {
    run(value: T) {
        console.log(value);
        return value;
    }
}


interface Length {
    length: number;
}

function logf<T extends Length>(value: T): T {
    console.log(value, value.length);
    return value;
}

logf('asdf'); // 参数有 length 属性即可。

/**
泛型的好处：
1. 函数和类轻松支持多种类型
2. 不比写多条函数重载，和冗长的联合类型
3. 灵活的控制类型直接的约束
**/


