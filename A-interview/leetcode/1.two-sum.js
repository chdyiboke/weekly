/*https://cattle.w3fun.com/solution/easy/438-find-all-anagrams-in-a-string.html
 * @lc app=leetcode id=1 lang=javascript
 *
 * [1] Two Sum
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// var twoSum = function(nums, target) {
//     for(let i = 0; i<nums.length; i++){
//         for(let j = 0; j<nums.length; j++){
        
//             if((nums[i]+nums[j]) === target && i!=j){
//                 return [i,j];
//             }
//         } 
//     }
// };

var twoSum = function(nums, target) {
    const obj = {}
    for (let i = 0; i < nums.length; i++){
        if(obj[target - nums[i] ] >= 0){
            return [ obj[target - nums[i] ], i]
        }
        obj[nums[i]] = i;
     }
 }

/*
var twoSum = function(nums, target, i = 0, objs = {}) {
    const obj = objs;
    if(obj[target - nums[i] ] >= 0 ) {
        return [ obj[target - nums[i]], i ]
    } else {
        obj[ nums[i] ] = i;
        i++;
        if(i < nums.length - 1){
            return twoSum(nums, target, i, obj)
        }else {
            console.error('twoSum is not find');
        }
    }
}
*/
