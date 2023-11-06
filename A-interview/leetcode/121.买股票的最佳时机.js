/*
 * @lc app=leetcode id=121 lang=javascript
 *
 * [121] Best Time to Buy and Sell Stock
 */
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    //5.1%  min   -    max
    /*   最好不要使用 Math.max.apply函数。
    let arr = [];
    for (let i = 0; i < prices.length-1; i++) {
        arr.push(Math.max.apply(this, prices.slice(i+1, prices.length)) - prices[i]);
    }
    const max = Math.max.apply(this, arr);
    if (max < 0 ) return 0;
    return max;
    */

/*   最好不要使用 Math.max.apply函数。
    let last = 0, let = 0;
    for (let i = 0; i < prices.length - 1; ++i) {
        last = Math.max(0, last + prices[i+1] - prices[i]);
        profit = Math.max(profit, last);
    }
    return profit;
    */


    let min = prices[0];
    let max = 0;
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < min)
            min = prices[i];
        if (prices[i] - min > max)  // if 后面的最大差值比max小 - false
            max = prices[i] - min;
    }
    return max;
};
