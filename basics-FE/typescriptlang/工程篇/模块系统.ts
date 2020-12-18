// es6
import { a, b, c } from '**'; // 批量导入
import { f as F } from '**';  // 导入时起别名


/**
 * @param {number} x - x
 * @param {number} y - y
 */
export function add(x, y) {
    return x + y
}

// commonjs  node   全局安装 ts-node  可以执行 ts-node ts文件
let c1 = require('./a.node')


let a = {
    x: 1,
    y: 2
}

module.exports = a


// exports === module.exports
// 导出多个变量 注意：如果用顶级的导出（module.exports），则会覆盖下面的c d exports。
// module.exports = {}
exports.c = 3
exports.d = 4

// 2个模块兼容性，就有了特殊的处理
// typescript
// 1. 模块不要混用
// 2. 兼容性 export =  会被编译成 module.exports =


// 兼容性写法

// 栗子
// node
require('../es6/d')
// ../es6/d
export = function () {
    console.log("I'm default")
}
// export let a = 1



