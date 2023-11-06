// const s = 'abcabcddd';
// function func(str) {
//   const n = s.length;
//   // 使用map来记录单个ch最后出现的位置
//   const map = new Map();
//   // [l, r]为一个窗口
//   let l = 0,
//     ans = 0;
//   for (let r = 0; r < n; r++) {
//     if (map.has(s[r])) {
//       l = Math.max(l, map.get(s[r]) + 1);
//     }
//     console.error('r', r, l, map);
//     map.set(s[r], r);
//     ans = Math.max(ans, r - l + 1);
//   }
//   return ans;
// }
// func(s);

const s = 'abcabcddd';
function func(str) {
  const n = str.length;
  const m = new Map();
  let l = 0;
  let max = 1;
  for (let r = 0; r < n; r++) {
    if (m.has(str[r])) {
      l = Math.max(l, m.get(str[r]) + 1);
    }
    m.set(str[r], r);
    max = Math.max(max, r - l + 1);
  }
  return max;
}

func(s);

 rl 0 0 Map(0) {size: 0}
 rl 1 0 Map(1) {'a' => 0}
 rl 2 0 Map(2) {'a' => 0, 'b' => 1}
 rl 3 1 Map(3) {'a' => 0, 'b' => 1, 'c' => 2}
 rl 4 2 Map(3) {'a' => 3, 'b' => 1, 'c' => 2}
 rl 5 3 Map(3) {'a' => 3, 'b' => 4, 'c' => 2}
 rl 6 3 Map(3) {'a' => 3, 'b' => 4, 'c' => 5}
 rl 7 7 Map(4) {'a' => 3, 'b' => 4, 'c' => 5, 'd' => 6}
 rl 8 8 Map(4) {'a' => 3, 'b' => 4, 'c' => 5, 'd' => 7}