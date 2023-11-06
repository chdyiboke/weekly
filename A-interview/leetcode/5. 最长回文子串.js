/**
 * @param {string} s
 * @return {string}
 */
/*
暴力破解

*/
var longestPalindrome = function(s) {
    var max = 0;
    var maxSubString = "";
    for(let i=0; i<s.length; i++){
        for(let j=i+1; j<s.length+1; j++){
            if(isPalindrom(s.substring(i,j))){
                if(j-i > max){  // 有更长的，则更新最长子串
                    max = j-i;
                    maxSubString = s.substring(i,j);
                }

            }
        }
    }
    return maxSubString
};

var isPalindrom = function(s){
    var l = s.length;
    var flag = 0;
    for (let i=0; i<l/2; i++){
        if(s[i]!==s[l-1-i]){
            flag = 1;
        }
    }
    if(flag === 1){
        return false;
    }
    return true;
};