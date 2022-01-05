console.log(Symbol("foo"));
console.log(Symbol("bba"));
const obj = {};
obj[Symbol("foo")] = 123;
obj[Symbol("bba")] = 123;
console.log(obj);
// 获取相同symbol
const s1 = Symbol.for("foo");
const s2 = Symbol.for("foo");
console.log(s2 === s1);
// 自定义 toString 标签
const obj = {
  [Symbol.toStringTag]: "hahaha",
  [Symbol()]: "ttttt",
};
console.log(obj.toString());
// 获取 Symbol 属性名
console.log(Object.getOwnPropertySymbols(obj));
