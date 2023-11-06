// 栈问题
// 有效的括号-20

// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 注意空字符串可被认为是有效字符串。

// 输入: "()[]{}"
// 输出: true

// 输入: "([)]"
// 输出: false

let isValid = function (s) {
  let sl = s.length;
  if (sl % 2 !== 0) return false;
  // 用来匹配左右括号的栈
  let stack = [];
  let leftToRight = {
    '{': '}',
    '[': ']',
    '(': ')',
  };

  let rightToLeft = {
    '}': '{',
    ']': '[',
    ')': '(',
  };
  for (let i = 0; i < s.length; i++) {
    let bracket = s[i];
    // 左括号 放进栈中
    if (leftToRight[bracket]) {
      stack.push(bracket);
    } else {
      // "()[]{}"
      let needLeftBracket = rightToLeft[bracket];
      // 左右括号都不是 直接失败
      if (!needLeftBracket) {
        return false;
      }

      // 栈中取出最后一个括号 如果不是需要的那个左括号 就失败
      let lastBracket = stack.pop();
      if (needLeftBracket !== lastBracket) {
        return false;
      }
    }
  }

  if (stack.length) {
    return false;
  }
  return true;
};
isValid('([)]');
