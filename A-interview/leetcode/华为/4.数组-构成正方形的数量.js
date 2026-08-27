// 题目描述
// 输入N个互不相同的二维整数坐标，求这N个坐标可以构成的正方形数量。[内积为零的的两个向量垂直]

// 输入描述
// 第一行输入为N，N代表坐标数量，N为正整数。N <= 100

// 之后的 K 行输入为坐标x y以空格分隔，x，y为整数，-10<=x, y<=10

// 输出描述
// 输出可以构成的正方形数量。

// 示例1
// 输入

// 3
// 1 3
// 2 4
// 3 1
// 1
// 2
// 3
// 4
// 输出

// 0
// 1,2,3,4,5,6,7,8,9

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let n;
let coordinates = [];

// 判断两个点是否相等
function arePointsEqual(p1, p2) {
    return p1[0] === p2[0] && p1[1] === p2[1];
}

// 检查一个点是否存在于点数组中
function pointExists(points, p) {
    for (let point of points) {
        if (arePointsEqual(point, p)) {
            return true;
        }
    }
    return false;
}

rl.on('line', (line) => {
    if (n === undefined) {
        n = parseInt(line);
    } else {
        coordinates.push(line.split(' ').map(Number));
        if (coordinates.length === n) rl.close();
    }
});

rl.on('close', () => {
    let squareCount = 0;

    // 遍历所有点对，检查是否能构成正方形
    for (let i = 0; i < n; i++) {
        let [x1, y1] = coordinates[i];

        for (let j = i + 1; j < n; j++) {
            let [x2, y2] = coordinates[j];

            // 计算两个可能的对角点
            let x3 = x1 - (y1 - y2), y3 = y1 + (x1 - x2);
            let x4 = x2 - (y1 - y2), y4 = y2 + (x1 - x2);

            if (pointExists(coordinates, [x3, y3]) && pointExists(coordinates, [x4, y4])) {
                squareCount++;
            }

            // 计算另外两个可能的对角点
            let x5 = x1 + (y1 - y2), y5 = y1 - (x1 - x2);
            let x6 = x2 + (y1 - y2), y6 = y2 - (x1 - x2);

            if (pointExists(coordinates, [x5, y5]) && pointExists(coordinates, [x6, y6])) {
                squareCount++;
            }
        }
    }

    // 每个正方形被计算了4次，因此结果需要除以4
    console.log(Math.floor(squareCount / 4));
});

// 代码2
const readline = require('readline');

// 创建接口读取标准输入输出
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let n; // 用于存储坐标数量
let coordinates = []; // 存储坐标的数组

// 监听每行输入
rl.on('line', (line) => {
    if (!n) {
        // 第一行输入是坐标数量
        n = parseInt(line);
        return;
    }

    // 其余的行是坐标点
    coordinates.push(line);

    // 当输入的坐标数达到n时，关闭输入流
    if (coordinates.length === n) {
        rl.close();
    }
});

// 当输入完成时
rl.on('close', () => {
    let squareCount = 0; // 记录正方形数量
    let set = new Set(coordinates); // 用集合存储坐标点，便于快速查找

    // 遍历所有坐标点对
    for (let i = 0; i < n; i++) {
        // 将第一个坐标点分割为x1和y1
        let [x1, y1] = coordinates[i].split(' ').map(Number);

        for (let j = i + 1; j < n; j++) {
            // 将第二个坐标点分割为x2和y2
            let [x2, y2] = coordinates[j].split(' ').map(Number);

            // 计算两个可能的对角点
            let x3 = x1 - (y1 - y2), y3 = y1 + (x1 - x2);
            let x4 = x2 - (y1 - y2), y4 = y2 + (x1 - x2);

            // 检查这两个对角点是否存在于坐标集合中
            if (set.has(`${x3} ${y3}`) && set.has(`${x4} ${y4}`)) {
                squareCount++;
            }

            // 计算另外两个可能的对角点
            let x5 = x1 + (y1 - y2), y5 = y1 - (x1 - x2);
            let x6 = x2 + (y1 - y2), y6 = y2 - (x1 - x2);

            // 检查这两个对角点是否存在于坐标集合中
            if (set.has(`${x5} ${y5}`) && set.has(`${x6} ${y6}`)) {
                squareCount++;
            }
        }
    }

    // 每个正方形被计算了4次，因此结果需要除以4
    console.log(Math.floor(squareCount / 4));
});
