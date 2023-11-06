/*
 * @lc app=leetcode id=121 lang=javascript
 *
 * [121] Best Time to Buy and Sell Stock
 */
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {

    let buy = prices[0];
    let sell = prices[0];
    let max = 0;
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            sell = prices[i];
            if (prices[i] >= prices[i + 1] || i === prices.length-1) {
                max = max + sell - buy;
            }
        }
        if (prices[i] <= prices[i - 1] && prices[i] <= prices[i + 1]) {
            buy = prices[i];
        }
    }
    return max;
};
