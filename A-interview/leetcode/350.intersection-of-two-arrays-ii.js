/*
 * @lc app=leetcode id=350 lang=javascript
 *
 * [350] Intersection of Two Arrays II
 */
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
    let arr1 = nums1.sort((a,b)=>a-b);
    let arr2 = nums2.sort((a,b)=>a-b);
    let arr =[];
    let m=0 ,n=0;
    while(m< arr1.length && n < arr2.length){
        if(arr1[m] ===  arr2[n]){
            arr.push(arr1[m]);
            m++;
            n++;
        }else if(arr1[m] < arr2[n]){
            m++;
        }else{
            n++;
        }
    }
    return arr;
};

