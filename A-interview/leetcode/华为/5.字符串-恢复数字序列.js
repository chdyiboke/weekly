// 对于一个连续正整数组成的序列，可以将其拼接成一个字符串，再将字符串里的部分字符打乱顺序。如序列8 9 10 11 12，拼接成的字符串为89101112，打乱一部分字符后得到90811211，原来的正整数10就被拆成了0和1。

// 现给定一个按如上规则得到的打乱字符的字符串，请将其还原成连续正整数序列，并输出序列中最小的数字。

// 输入描述
// 输入一行，为打乱字符的字符串和正整数序列的长度，两者间用空格分隔，字符串长度不超过200，正整数不超过1000，保证输入可以还原成唯一序列。

// 输出描述
// 输出一个数字，为序列中最小的数字。

// 示例1
// 输入

// 19801211 5
// 1
// 输出

// 8

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    // 输入打乱字符的字符串和正整数序列的长度
    const s = input.split(' ')[0];
    const k = parseInt(input.split(' ')[1]);

    // 创建一个Map，用于统计打乱字符的字符串中各字符的数量
    const base = new Map();
    for (const c of s) {
        base.set(c, (base.get(c) || 0) + 1);
    }

    // 初始化滑动窗口的起始位置
    let i = 1;
    // 当滑动窗口的起始位置小于等于1000减去序列长度加1时，继续循环
    while (i <= 1000 - k + 1) {
        // 创建一个Map，用于计算滑动窗口内各字符的数量
        const count = new Map();
        // 遍历滑动窗口内的正整数
        for (let j = i; j < i + k; j++) {
            // 将正整数转换为字符串
            const num = String(j);
            // 遍历正整数字符串中的字符
            for (const c of num) {
                // 将字符及其数量存入Map
                count.set(c, (count.get(c) || 0) + 1);
            }
        }

        // 初始化一个布尔变量，用于判断滑动窗口内各字符数量是否与打乱字符的字符串中各字符数量一致
        let isMatch = true;
        // 遍历打乱字符的字符串中的字符
        for (const c of base.keys()) {
            // 如果滑动窗口内的字符数量与打乱字符的字符串中的字符数量不一致，将isMatch设为false并跳出循环
            if (!count.has(c) || count.get(c) - base.get(c) !== 0) {
                isMatch = false;
                break;
            }
        }

        // 如果滑动窗口内各字符数量与打乱字符的字符串中各字符数量一致，则输出滑动窗口的起始位置并返回
        if (isMatch) {
            console.log(i);
            return;
        }

        // 更新滑动窗口的起始位置
        i++;
    }
});