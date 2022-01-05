/**
 * 原始类型（严格模式）
 */

const a: string = 'string'

const b: number = 100; // NaN Infinity

const c: boolean = false;

// const d: boolean = null;

const e: void = undefined;

const f: null = null;

const g: undefined = undefined;
// 需要版本为 ES2015
const h: symbol = Symbol()

/**
 * Object 类型（严格模式）
 */
const foo: object = {}
// const foo: object = []
// const foo: object = function(){}
const obj: { foo: number, bar: string} = { foo:123,bar:'aa' }

/**
 * 数组类型（严格模式）
 */
const arr1: Array<number> = [1,3,4]
const arr2: number[] = [1,3,4,5,6]

/**
 * 元组类型
 */
const tuple: [number, string] = [123, 'ha']

/**
 * 枚举类型
 */
// enum Color {
//   Red,
//   Green,
//   Blue,
// }
// const color: Color = Color.Green;

const enum Color {
  Red='red',
  Green='green',
  Blue='blue',
}
const colorName: string = Color.Red;

console.log(colorName); // 显示'Green'因为上面代码里它的值是2

/**
 * 函数类型
 */
function add(a: number, b: number): number {
  return a + b;
}

const func: (a: number, b: number) => number = function (a: number, b: number): number {
  return a * b;
}

/**
 * 任意类型
 */
let child: any = 'rob';

child = 123

child = false

/**
 * 类型断言
 */
const nums = [1,3,4,5,6];
const res = nums.find(num => num > 0)
// const square = res * res; // 无法确定其类型
const num1 = res as number;
const num2 = <number>res; // JSX 下会和标签语法冲突
