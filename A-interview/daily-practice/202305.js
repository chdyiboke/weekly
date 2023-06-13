/**
 * 1.计算多个区间的交集
 *   区间用长度为2的数字数组表示，如[2, 5]表示区间2到5（包括2和5）；
 *   区间不限定方向，如[5, 2]等同于[2, 5]；
 *   实现`getIntersection 函数`
 *   可接收多个区间，并返回所有区间的交集（用区间表示），如空集用null表示
 * 示例：
 *   getIntersection([5, 2], [4, 9], [3, 6]); // [4, 5]
 *   getIntersection([1, 7], [8, 9]); // null
 */
// 区间里面有可能为负数吗？
function getIntersection(...args) {
  // 区间排序=》2个数组 最大：3[2,3] 最小 5[5,6]
  // [[2,3], [3, 6]]
  if (args.length === 0) return null;
  let min = -Infinity;
  let max = Infinity;
  const len = args.length;
  for (let i = 0; i < len; i++) {
    // 如果逆向翻转
    if (args[i][0] > args[i][1]) {
      [args[i][0], args[i][1]] = [args[i][1], args[i][0]];
    }
    // 找出左侧最大值
    if (args[i][0] > min) {
      min = args[i][0];
    }
    // 找出右侧最小值
    if (args[i][1] < max) {
      max = args[i][1];
    }
  }

  if (min < max) {
    return [min, max];
  }

  return null;
}
getIntersection([5, 2], [4, 9], [3, 6]);

// 比较两个版本号大小
// 数组去重
// 顺序数组打乱顺序

// 数组转树（除了递归还有什么其他的）
