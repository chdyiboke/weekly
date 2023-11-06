/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    if(nums.length === 0)return 0;
    if(nums.length === 1)return nums[0];
    if(nums.length === 2)return Math.max(...nums);
    
    // 动态规划 方程 f(i) = Math.max(f(i-1), f(i-2)+nums[i])
    // f(k) = 从前 k 个房屋中能抢劫到的最大数额， nums[i] = 第 i 个房屋的钱数。
    let prepre = nums[0];
    let pre = Math.max(nums[0], nums[1]);
    for(let i = 2; i < nums.length; i++){
        let cur = Math.max(pre, prepre + nums[i]);
        prepre = pre;
        pre = cur;
    }
    return pre;
};