const s = new Set();

s.add(1).add(2).add(3).add(4);

console.log(s);
// 循环
for (item of s) {
  console.log(item);
}
// 大小
console.log(s.size);
// 判断是否存在
console.log(s.has(1));
// 删除
console.log(s.delete(1));
console.log(s);
// 清空集合
s.clear();
console.log(s);
// 数组转换
const arr = [1, 2, 3, 4, 5, 6, 7];
// const result = Array.from(new Set(arr));
const result = [...new Set(arr)];
console.log(result);
