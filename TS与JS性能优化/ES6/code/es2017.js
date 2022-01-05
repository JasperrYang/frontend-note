// const person = {
//   name: "李四",
//   sex: "男",
//   age: 18,
// };
// Object.values;
// console.log(Object.keys(person));
// console.log(Object.values(person));
// Object.entries;
// console.log(Object.entries(person));
// for (const [key, value] of Object.entries(person)) {
//   console.log(key, value);
// }
// console.log(new Map(Object.entries(person)));
// Object.getOwnPropertyDescriptors;
const p1 = {
  firstName: "jasper",
  lastName: "yang",
  get fullName() {
    return this.firstName + this.lastName;
  },
};
console.log(p1.fullName);
// 通过 Object.assign 方式复制对象 get 方法被当作普通属性复制过来，所以更改 lastName 并没有改变 p2
// const p2 = Object.assign({}, p1);
// p2.lastName = "wang";
// console.log(p2.fullName);
const desc = Object.getOwnPropertyDescriptors(p1);
const p2 = Object.defineProperties({}, desc);
p2.lastName = "wang";
console.log(p2.fullName);
// String.prototype.padStart / String.prototype.padEnd
// const obj = {
//   num: 10,
//   perice: 100,
// };
// for (const [name, count] of Object.entries(obj)) {
//   console.log(
//     `${name.padStart(10, "-")}|${count.toString().padStart(10, "0")}`
//   );
// }
// 在函数尾部添加逗号
