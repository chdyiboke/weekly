/*
 * @lc app=leetcode id=92 lang=javascript
 *
 * [92] Reverse Linked List II
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} m
 * @param {number} n
 * @return {ListNode}
 * 1-2-3-4-5   位置  2 、 4
 */
var reverseBetween = function(head, m, n) {

    let cur = head, prev = null;
    while (m > 1) {
        prev = cur;
        cur = cur.next;
        m--;
        n--;
    }
    let con = prev, tail = cur;   //con 1    tail 2
    let third = null;
    while (n > 0) {   //prev 4   cur 5  到cur没有翻转，记录了尾部连接位置。
        third = cur.next;
        cur.next = prev;
        prev = cur;
        cur = third;
        n--;
    }
    //连接  con.next = prev    tail.next = cur
    if (con != null) {
        con.next = prev;
    } else {
        head = prev;
    }
    tail.next = cur;
    return head;
}


