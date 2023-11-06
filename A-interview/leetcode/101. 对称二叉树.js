/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 * 递归和迭代两种方法解决这个问题，会很加分。
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
//迭代
    // var isSymmetric = function(root) {
    // let res=[];
    // inOrder(root);
    // if(res.length%2===0&&root) return false; //如果树的节点数是偶数(排除0) 返回false;
    
    // //用首尾双指针判断是否回文数组:
    // let i=0;
    // let j=res.length-1;
    // while(i < j){
    //       if(res[i].val!=res[j].val||res[i].pos===res[j].pos) return false;    
    //       i++;
    //       j--;
    // }
    // return true;
    // //中序遍历: 对称树必定会输出一个回文数组,再加上节点的位置标记
    // function inOrder(root,pos=NaN){
    //     if(root!=null){
    //     inOrder(root.left,'l')
    //     res.push({val:root.val,pos});
    //     inOrder(root.right,'r')
    //   }
    // }
    // };
//递归
var isSymmetric = function(root) {
    return isMirror(root, root);
}

function isMirror(t1, t2) {
    if (t1 == null && t2 == null) return true;
    if (t1 == null || t2 == null) return false;
    return (t1.val == t2.val)
        && isMirror(t1.right, t2.left)
        && isMirror(t1.left, t2.right);
};





