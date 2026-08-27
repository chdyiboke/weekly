
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 
 * @param nums int整型一维数组 分配表，数组
 * @param k int整型 团队数量
 * @return int整型
 */

// 输入[4, 3, 6, 9, 7], 2

// 输出 16
// 可能的切分
// 1、[4],[3,6,9,7]，最大值：25
// 2、[4,3],[6,9,7]，最大值：22
// 3、[4,3,6],[9,7]，最大值：16
// 4、[4,3,6,9],[7]，最大值：22
// 因此，最大值最小的切分方式是3，返回16

// 末世时代
function alloc(nums, k) {
    let res = 0;
    // nums 资源数组 k 多少个组 return 最大值
    if (k === 1) {
        for (let i = 0; i < nums.length; i++) {
            res = nums[i] + res;
        }
    }
    // 当营地数量为2时
    if (k === 2) {
        let left = 0;
        let total1 = 0;
        let total2 = 0;
        let maxs = [];
        for (let i = 0; i < nums.length; i++) {
            // [4],[3,6,9,7]
            total1 = [...nums.slice(0, i + 1)].reduce((a, b) => a + b, 0);
            total2 = [...nums.slice(i + 1)].reduce((a, b) => a + b, 0);
            maxs.push(Math.max(total1, total2));
            left++;
        }
        res = Math.min(...maxs);
    }





}
module.exports = {
    GetKLevelValues: GetKLevelValues,
    alloc: alloc
};




/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 获取二叉树第 k 层节点的不同值，按升序排列
 * @param n int整型 二叉树节点数量
 * @param vals int整型一维数组 各节点的值，vals[i] 为节点 i 的值
 * @param edges int整型二维数组 边列表，每条边描述为 [parent, child]
 * @param k int整型 目标层级（0-indexed，根节点为第 0 层）
 * @return int整型一维数组
 */

// 示例一：输入 7,[1,2,3,4,8,6,7],[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]],2  输出：[4,6,7,8]
// 示例二：3,[10,20,20],[[0,1],[0,2]],1  输出：[20]
function GetKLevelValues(n, vals, edges, k) {
    if (k < 0 || n <= 0) return [];
    if (k === 0) {
        const set = new Set([vals[0]]);
        return [...set].sort((a, b) => a - b);
    }

    // 1. 构建 parent -> children[] 邻接表
    const children = Array.from({ length: n }, () => []);
    for (const [p, c] of edges) {
        children[p].push(c);
    }

    // 2. BFS 逐层遍历
    let currentLevel = [0]; // 第 0 层：根节点 0
    let level = 0;

    while (level < k && currentLevel.length > 0) {
        const nextLevel = [];
        for (const node of currentLevel) {
            for (const child of children[node]) {
                nextLevel.push(child);
            }
        }
        currentLevel = nextLevel;
        level++;
    }

    // 没到第 k 层（树深度不够）
    if (level < k) return [];

    // 3. 取值 -> 去重 -> 升序
    const uniqueValues = new Set(currentLevel.map(node => vals[node]));
    return [...uniqueValues].sort((a, b) => a - b);
}








// LLM 推理批次最大化

// [[1, 3], [2, 5], [4, 7], [6, 9],  [8,10], [11, 12]]

// 4

/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 最大LLM推理批次
 * @param requests int整型二维数组 所有推理请求所占连续位置
 * @return int整型
 */
function max_llm_batch(requests) {
    if (!requests || requests.length === 0) return 0;
    if (requests.length === 1) return 1;

    // 按结束时间升序排序（贪心：选结束最早的区间，留给后面的空间最大）
    const sorted = requests.slice().sort((a, b) => a[1] - b[1]);

    let count = 1;               // 至少能选一个
    let lastEnd = sorted[0][1];  // 上一个选中区间的结束位置

    for (let i = 1; i < sorted.length; i++) {
        // 闭区间端点重叠也算相交：[1,3] 与 [3,3] 共享点 3，不能同批
        // 所以用 > 严格大于，而不是 >=
        // 验证: [[1, 3], [2, 4], [3, 3], [4, 4]] => 选 [1,3] 和 [4,4]，返回 2
        if (sorted[i][0] > lastEnd) {
            count++;
            lastEnd = sorted[i][1];
        }
    }
    return count;
}

// 测试
console.log(max_llm_batch([[1, 3], [2, 5], [4, 7], [6, 9], [8, 10], [11, 12]]));
// 4
console.log(max_llm_batch([[1, 3], [2, 4], [3, 3], [4, 4]]));
// 2



//  获取二叉树第K层的数值

// 7,[1,2,3,4,8,6,7],[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]],2

// [4,6,7,8]



































// 用 React（TypeScript）实现一个「可搜索列表」页面。

// 1. 顶部一个受控输入框：展示用户正在输入的内容。
// 2. 防抖：用户停止输入 300ms 之后，才触发一次搜索请求（不要每个字符都请求）。
// 3. 搜索函数请自行 mock，例如 mockSearch(keyword)：
//    - 用 setTimeout 模拟网络，延迟请做成 200–800ms 之间的随机值（不要写死同一个延迟）；
//    - 在假数据里按 keyword 过滤后返回（自己写 5～8 条即可，字段至少要有 id、title）。
// 4. 请求竞态：用户快速连续输入时，界面只展示「最后一次请求」对应的结果。
//    先发出、后返回的旧请求，不得覆盖新结果（列表不能闪回旧关键词的数据）。
// 5. 状态展示：
//    - 请求进行中有 loading；
//    - 无匹配结果时有空状态提示。
// js 防抖/请求竞态 mockSearch(keyword)

// let loading = false;
// let empty = true;
// let list = [];
// const de = debouceSearch();
// function search(keyword) {
//     de(() => {
//         // 开始搜索，清空列表
//         list = [];
//         loading = true;
//         // 模拟网络延迟
//         setTimeout(() => {
//             loading = false;
//         }, Math.random() * 600 + 200);
//         // 请求竞态
//         if (keyword !== lastKeyword) {
//             return;
//         }
//         // 模拟搜索结果
//         const result = mockSearch(keyword);
//         list = result.list;
//         loading = false;
//         empty = list.length === 0;
//     });
// }

// function debouceSearch(fn) {
//     return function (args) {
//         const timer = setTimeout(() => {
//             if (timer) {
//                 fn.apply(args);
//                 timer = null;
//             }
//         }, 300)
//     }
// }



