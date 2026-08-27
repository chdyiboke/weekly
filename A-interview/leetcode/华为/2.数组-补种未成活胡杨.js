/**
题目描述
近些年来，我国防沙治沙取得显著成果。某沙漠新种植N棵胡杨（编号1 - N），排成一排。

一个月后，有M棵胡杨未能成活。

现可补种胡杨K棵，请问如何补种（只能补种，不能新种），可以得到最多的连续胡杨树？

输入描述
N 总种植数量，1 <= N <= 100000

M 未成活胡杨数量，M 个空格分隔的数，按编号从小到大排列，1 <= M <= N

K 最多可以补种的数量，0 <= K <= M

输出描述
最多的连续胡杨棵树

示例1
输入

5
2
2 4
1
1
2
3
4
输出

3
1
说明

补种到2或4结果一样，最多的连续胡杨棵树都是3。

示例2
输入

10
3
2 4 7
1
1
2
3
4
输出

6
1
说明

种第7棵树，最多连续胡杨树棵数位6（5，6，7，8，9，10）
**/

const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const inputLines = [];
rl.on('line', (input) => {
    inputLines.push(input);
});

rl.on('close', () => {
    // 读取胡杨树的总数N
    const total = parseInt(inputLines[0]);

    // 读取未成活胡杨树的数量M
    const deadCount = parseInt(inputLines[1]);

    // 读取未成活胡杨树的编号列表
    const deadList = inputLines[2].split(' ').map(Number);

    // 读取可以补种的胡杨树数量K
    const supplementCount = parseInt(inputLines[3]);

    // 初始化数组，所有树最初都是成活的，0表示成活，1表示未成活
    const nums = new Array(total).fill(0);

    // 根据输入，将未成活的树的位置标记为1
    deadList.forEach(num => {
        nums[num - 1] = 1; // 树的编号从1开始，因此需要减1
    });

    // 初始化滑动窗口的左右边界
    let left = 0;
    let maxLen = 0; // 用于存储最大连续成活区域的长度
    let sumLeft = 0; // 滑动窗口左边界的未成活树数量
    let sumRight = 0; // 滑动窗口右边界的未成活树数量

    // 遍历所有的树，right代表滑动窗口的右边界
    for (let right = 0; right < total; right++) {
        sumRight += nums[right]; // 更新右边界的未成活树数量

        // 如果窗口内的未成活树数量大于可以补种的数量
        while (sumRight - sumLeft > supplementCount) {
            sumLeft += nums[left]; // 缩小窗口，左边界右移
            left++;
        }

        // 更新最大成活区域的长度
        maxLen = Math.max(maxLen, right - left + 1);
    }

    // 输出最大连续成活区域的长度
    console.log(maxLen);
});
