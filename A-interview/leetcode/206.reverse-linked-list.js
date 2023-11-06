/*
 * @lc app=leetcode id=206 lang=javascript
 *
 * [206] Reverse Linked List
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/** 另一种：头插法
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  let pre = null;
  let cur = head;
  while(cur !== null) {
    let nextTemp = cur.next;
    cur.next = pre;
    pre = cur;
    cur = nextTemp;
  }
  return pre;
};

