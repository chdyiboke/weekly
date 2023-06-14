/** 文本左右对齐(模拟法)
 * 
给定一个单词数组words和一个长度maxWidth，重新排版单词，使其成为每行恰好有maxWidth个字符，且左右两端对齐的文本。
你应该使用 “贪心算法” 来放置给定的单词；也就是说，尽可能多地往每行中放置单词。必要时可用空格' '填充，使得每行恰好有maxWidth个字符。
要求尽可能均匀分配单词间的空格数量。如果某一行单词间的空格不能均匀分配，则左侧放置的空格数要多于右侧的空格数。
文本的最后一行应为左对齐，且单词之间不插入额外的空格。
注意:

单词是指由非空格字符组成的字符序列。
每个单词的长度大于 0，小于等于 maxWidth。
输入单词数组 words 至少包含一个单词。

提示:

1 <= words.length <= 300
1 <= words[i].length <= 20
words[i]由小写英文字母和符号组成
1 <= maxWidth <= 100
words[i].length <= maxWidth

示例:
js复制代码输入: words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16
输出:
[
   "This    is    an",
   "example  of text",
   "justification.  "
]
 */
/**
 * @description: 模拟法   TC:O(n)   SC:O(1)
 * @author: JunLiangWang
 * @param {*} words
 * @param {*} maxWidth
 * @return {*}
 */
function simulation(words, maxWidth) {
  /**
   * 作为困难题，该题并未太大价值，题解是从参考答案中copy的
   */

  const ans = [];
  let right = 0,
    n = words.length;
  while (true) {
    const left = right; // 当前行的第一个单词在 words 的位置
    let sumLen = 0; // 统计这一行单词长度之和
    while (
      right < n &&
      sumLen + words[right].length + right - left <= maxWidth
    ) {
      sumLen += words[right].length;
      right++;
    }

    // 当前行是最后一行：单词左对齐，且单词之间应只有一个空格，在行末填充剩余空格
    if (right === n) {
      const s = words.slice(left).join(' ');
      ans.push(s + blank(maxWidth - s.length));
      break;
    }
    const numWords = right - left;
    const numSpaces = maxWidth - sumLen;

    // 当前行只有一个单词：该单词左对齐，在行末填充空格
    if (numWords === 1) {
      ans.push(words[left] + blank(numSpaces));
      continue;
    }

    // 当前行不只一个单词
    const avgSpaces = Math.floor(numSpaces / (numWords - 1));
    const extraSpaces = numSpaces % (numWords - 1);
    const s1 = words
      .slice(left, left + extraSpaces + 1)
      .join(blank(avgSpaces + 1)); // 拼接额外加一个空格的单词
    const s2 = words
      .slice(left + extraSpaces + 1, right)
      .join(blank(avgSpaces)); // 拼接其余单词
    ans.push(s1 + blank(avgSpaces) + s2);
  }
  return ans;

  function blank(n) {
    return new Array(n).fill(' ').join('');
  }
}

/**
 * 1.掘金专栏
 *   https://juejin.cn/column/7210175991838130213
 *   给你两个二进制字符串 a 和 b ，以二进制字符串的形式返回它们的和。
 * 提示：

1 <= a.length, b.length <= 104
a 和 b 仅由字符 '0' 或 '1' 组成
字符串如果不是 "0" ，就不含前导零
示例：

输入: a = "11", b = "1"
输出： "100"
 */

function doublePoints(a, b) {
  /**
   * 该方案利用双指针的方式，定义两个指针分别指向a,b两数组最后一个
   * 元素，定义一个变量记录其是否有进位情况，然后从后向前遍历两数组
   * 元素，将两元素值(如果存在)与进位变量相加，当前位置的结果则等于
   * 相加后的和对2取余，是否存在进位则等于相加后的和除以2然后向下取
   * 整。当两指针都超出了数组索引范围此时结束循环。最后再判断是否存
   * 在进位，有则在结果前加一个'1'。
   */

  // 定义两指针
  let point1 = a.length - 1,
    point2 = b.length - 1,
    // 是否存在进位
    carry = 0,
    // 结果
    out = '';
  // 从后到前遍历两数组元素，当两指针都超出了数组索引结束循环
  while (a[point1] || b[point2]) {
    // 将两元素值(如果存在)与进位变量相加
    if (a[point1]) carry += a[point1] * 1;
    if (b[point2]) carry += b[point2] * 1;
    // 当前位置的结果则等于相加后的和对2取余
    out = (carry % 2) + out;
    // 否存在进位则等于相加后的和除以2然后向下取整
    carry = Math.floor(carry / 2);
    point1--;
    point2--;
  }
  // 最后如果还存在进位，则需要在结果前加一个'1'。
  if (carry != 0) out = '1' + out;
  // 返回结果
  return out;
}

getIntersection([5, 2], [4, 9], [3, 6]);

// 比较两个版本号大小
// 数组去重
// 顺序数组打乱顺序

// 数组转树（除了递归还有什么其他的）

/**
 * 给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。
最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。
你可以假设除了整数0之外，这个整数不会以零开头。
提示：

1 <= digits.length <= 100
0 <= digits[i] <= 9

示例：
ini复制代码输入： digits = [1,2,3]
输出： [1,2,4]
解释： 输入数组表示数字 123。
 */

function addOne(digits) {
  /**
   * 本方案利用模拟的方式，从后到前依次遍历数组给元素加一，
   * 当元素加一后并不需要进位(即:<10)，此时直接跳出循环返回
   * 结果即可，当元素需要进位则继续循环重复上一步骤。当遍历
   * 完所有元素，仍有进位，则在数组开头添加元素1。
   */

  // 从后向前遍历数组
  for (let i = digits.length - 1; i >= 0; i--) {
    // 给元素+1
    let sum = digits[i] + 1;
    // 将加一后的元素对10取余后重新赋值给元素
    // 之所以对10取余是防止进位的情况
    digits[i] = sum % 10;
    // 当加一对10取余后仍等于加一时的值，证明
    // 无进位的情况，直接返回即可
    if (digits[i] === sum) return digits;
  }
  // 遍历完所有元素并未跳出，证明还需要进一位
  // 在数组开头添加一个1元素
  digits.splice(0, 0, 1);
  // 返回结果
  return digits;
}
