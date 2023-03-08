import $ from 'jquery' // 声明文件 

$('.app').css('color', 'red')

// 3种类库的声明文件写法。 栗子： @types/koa

// 1. 全局 global-lib.js

globalLib({x: 1})
globalLib.doSomething()

// 声明文件 declare 为外部变量提供声明
declare function globalLib(options: globalLib.Options): void;

declare namespace globalLib {
    const version: string;
    function doSomething(): void;
    interface Options {
        [key: string]: any
    }
}

// 2. 模块类库 
// import moduleLib from './module-lib'
moduleLib({y: 2})
moduleLib.doSomething()

declare function moduleLib(options: Options): void

interface Options {
    [key: string]: any
}

declare namespace moduleLib {
    const version: string
    function doSomething(): void
}

export = moduleLib // 兼容性最好

// 3. umd 类库 

// import umdLib from './umd-lib'
umdLib.doSomething()

declare namespace umdLib {
    const version: string
    function doSomething(): void
}

export as namespace umdLib  // umd 库不可缺少的语句

export = umdLib

