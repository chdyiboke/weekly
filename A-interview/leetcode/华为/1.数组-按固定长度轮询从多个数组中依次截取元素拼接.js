// 按固定长度轮询从多个数组中依次截取元素拼接，直至所有数组取空‌。‌‌

// 题目规则与输入输出
// ‌合并逻辑‌：给定固定长度 len 和 num 个整数数组；按顺序遍历每个数组，每次从当前数组头部截取 len 个元素（不足则取剩余全部）加入结果，截断后原数组缩短；一轮遍历完若仍有非空数组，则回到第一个继续，直到所有数组为空。
// ‌输入格式‌：
// 第一行：固定长度 len（0 < len < 10）
// 第二行：数组个数 num（0 < num < 10000）
// 接下来 num 行：每行逗号分隔的整数数组（每行≤100 元素）
// ‌输出格式‌：一行逗号分隔的合并后整数序列（无空格）
// 示例
// 输入：
// 2
// 3
// 1,2,3
// 4,5,6
// 7,8,9
// 输出：
// 1,2,3,4,5,6,7,8,9

function mergeArrays(...lines) {
    if (lines.length < 2) return;

    const len = parseInt(lines[0]);
    const num = parseInt(lines[1]);

    // 将每个数组转换为队列（普通数组即可，shift从头部移除）
    const queues = [];
    for (let i = 0; i < num; i++) {
        const line = lines[i + 2] || '';
        queues.push(line ? line.split(',').map(Number) : []);
    }

    const result = [];
    let hasData = true;

    while (hasData) {
        hasData = false;
        for (let i = 0; i < num; i++) {
            const q = queues[i];
            if (q.length > 0) {
                hasData = true;
                // 核心：取出前 len 个元素，如果不足则取全部
                // splice(0, len) 会返回被删除的元素数组，并修改原数组
                const chunk = q.splice(0, len);
                result.push(...chunk);
            }
        }
    }

    console.log(result.join(','));
}

// 示例 1,2,4,5,7,8,3,6,9
mergeArrays('2', '3', '1,2,3', '4,5,6', '7,8,9');
// const chunk = q.splice(0, len);