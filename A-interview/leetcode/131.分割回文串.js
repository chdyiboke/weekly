/**
 * 递归
 * @param {string} s
 * @return {string[][]}
 */
var partition = function(s) {
    return partitionHelper(s, 0);
};

function partitionHelper(s, start) {
    //递归出口
    if (start == s.length) {
        let list = [], res = [];
        res.push(list);
        console.log(res,'res',list);
        return res;
    }
    let res = [];
    for (let i = start; i < s.length; i++) {
        //当前切割后是回文串才考虑
        if (isPalindrome(s.slice(start, i + 1))) {
            let left = s.slice(start, i + 1);
            //遍历后边字符串的所有结果，将当前的字符串加到头部
            for (let list of partitionHelper(s, i + 1)) {
                console.log(list,left,'------list------left--------------------')
                list.unshift(left);
                res.push(list);
            }
        }
    }
    return res;
}
function isPalindrome(s) {
    let i = 0;
    let j = s.length - 1;
    while (i < j) {
        if (s[i] != s[j]) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}
var s = "abb";
partition(s)