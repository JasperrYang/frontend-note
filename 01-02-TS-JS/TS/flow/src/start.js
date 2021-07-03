// @flow
function add(n: number, m: number) {
  return n + n;
}
add(2, 3);
add("2", "3"); // Error!
// 变量类型
let num: number = 100;
// 函数返回类型
function sum(): number() {}
// 基本类型
const a: string = 'aa';
const b: numebr = 11;
const c: boolean = false;
const d: null = null;
const e: void = undefined;
const f: symbol = Symbol();
// 数组
const arr1: Array<number> = [1, 2, 3];
const arr2: number[] = [1, 2, 3];
const foo: [String, number] = ["haha", 11];
// 对象类型
const obj1 = { foo: string, bar: number} = { foo: "haha", bae: 111 };
const obj2: { foo?: string, bar: number } = { bar: 100 }; // foo 可有可无
const obj3: { [string]: string } = {}; // 限制键值类型

obj3.key1 = 'value'
obj3.key2 = 'value'
// 函数类型
function foo(callback: (string, number) => void) {
  // 显示回调函数返回值类型
  callback('string', 100)
}
// 特殊类型
const a: 'foo' = 'foo'
const type: 'success' | 'warning' | 'danger' = 'success';
type StringOrNumber = string | number
const b: StringOrNumber = 'string';

const gender: ?number  = undefined;
const gender: number | undefined | null = undefined;
//mixed 强类型-所有
function passMixed(value: mixed) {
  if(typeof value === 'string') {
    value.substr(1)
  }
}
//any 弱类型-所有
function passAny(value: any) {
  value.substr(1)
}
