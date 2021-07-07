"use strict";
/**
 * 原始类型（严格模式）
 */
var a = 'string';
var b = 100; // NaN Infinity
var c = false;
// const d: boolean = null;
var e = undefined;
var f = null;
var g = undefined;
// 需要版本为 ES2015
var h = Symbol();
/**
 * Object 类型（严格模式）
 */
var foo = {};
// const foo: object = []
// const foo: object = function(){}
var obj = { foo: 123, bar: 'aa' };
/**
 * 数组类型（严格模式）
 */
var arr1 = [1, 3, 4];
var arr2 = [1, 3, 4, 5, 6];
/**
 * 元组类型
 */
var tuple = [123, 'ha'];
var colorName = "red" /* Red */;
console.log(colorName); // 显示'Green'因为上面代码里它的值是2
/**
 * 函数类型
 */
function add(a, b) {
    return a + b;
}
var func = function (a, b) {
    return a * b;
};
/**
 * 任意类型
 */
var child = 'rob';
child = 123;
child = false;
/**
 * 类型断言
 */
var nums = [1, 3, 4, 5, 6];
var res = nums.find(function (num) { return num > 0; });
// const square = res * res; // 无法确定其类型
var num1 = res;
var num2 = res; // JSX 下会和标签语法冲突
