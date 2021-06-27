// filter 高阶函数实现
Array.prototype.filterTest = function (fn) {
  let result = [];
  for (let index = 0; index < this.length; index++) {
    if (fn(this[index])) {
      result.push(this[index]);
    }
  }
  return result;
};

let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(array.filterTest((value) => value > 5));
