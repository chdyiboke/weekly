/*
 * @lc app=leetcode id=438 lang=javascript
 *
 * [438] Find All Anagrams in a String
 */
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
    
    // const length = p.length;
    // let arr = [];
    // const temp = p.split('').sort().join('');

    // for(let i =0;i<s.length;i++){
    //    if(s.slice(i,i+length).split('').sort().join('') === temp){
    //     arr.push(i);
    //    }
    // }
    // return arr;
    const map = {};
  for (let i = 0; i < p.length; i++) {
    const cur = p[i];
    if (map[cur] === undefined) map[cur] = 1;
    else map[cur] += 1;
  }
  let curMap = {};
  for (const key in map) {
    curMap[key] = 0;
  }
  const res = [];
  for (let i = 0; i < s.length; i++) {
    const cur = s[i];
    if (i < p.length - 1) {
      map[cur] !== undefined && (curMap[cur] += 1);
      continue;
    }
    const lastChar = s[i - p.length];
    if (map[lastChar] !== undefined) {
      curMap[lastChar] -= 1;
    }
    if (map[cur] !== undefined) {
      curMap[cur] += 1;
    }
    if (JSON.stringify(map) === JSON.stringify(curMap)) {
      res.push(i - p.length + 1);
    }
  }
  return res;
};


// class Solution {
//     public List<Integer> findAnagrams(String s, String p) {
//         List<Integer> result = new ArrayList<>();
//             int[] p_letter = new int[26];
//             for (int i = 0; i < p.length(); i++) {//记录p里面的数字分别有几个
//                 p_letter[p.charAt(i) - 'a']++;
//             }
//             int start = 0;
//             int end = 0;
//             int[] between_letter = new int[26];//记录两个指针之间的数字都有几个
//             while (end < s.length()) {
//                 int c = s.charAt(end++) - 'a';//每一次拿到end指针对应的字母
//                 between_letter[c]++;//让这个字母的数量+1
                
//                 //如果这个字母的数量比p里面多了,说明这个start坐标需要排除
//                 while (between_letter[c] > p_letter[c]) {
//                     between_letter[s.charAt(start++) - 'a']--;
//                 }
//                 if (end - start == p.length()) {
//                     result.add(start);
//                 }
//             }
//             return result;
//     }
// }

