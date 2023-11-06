/*
 * @lc app=leetcode id=15 lang=javascript
 *
 * [15] 3Sum
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    let res = [];
    let length = nums.length;
    nums.sort((a, b) => a - b); //先排序 
    if (nums[0] <= 0 && nums[length - 1] >= 0) {  //排除全为负数或正数的情况
      for (let i = 0; i < length - 2;) {
        if (nums[i] > 0) break;
        let low = i + 1;
        let heigh = length - 1;
        do {
          if (low >= heigh || nums[i] * nums[heigh] > 0){ break }  //三人同符号，则退出
          let result = nums[i] + nums[low] + nums[heigh]
          if (result === 0) { 
            res.push([nums[i], nums[low], nums[heigh]])
          }
          if (result <= 0 ) {
            while (low < heigh && nums[low] === nums[++low]){}  // 如果相等就跳过
          } else {
            while (low < heigh && nums[heigh] === nums[--heigh]) {}
          }
        } while (low < heigh)
        while (nums[i] === nums[++i]) {}
      }
    }
    return res
};

