/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function(p, q) {
    return tree(p, q);
};

function tree(p, q){
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    return (p.val == q.val) 
    && tree(p.left,q.left) 
    && tree(p.right,q.right);
}