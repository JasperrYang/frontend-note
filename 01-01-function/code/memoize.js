const _ = require("lodash");

function getArea(r) {
  return Math.PI * r * r;
}

// memoize 实现
function memoize(fn) {
  let cache = {};
  return function () {
    let arg_str = JSON.stringify(arguments);
    cache[arg_str] = cache[arg_str] || fn.apply(fn, arguments);
    return cache[arg_str];
  };
}
let getAreaWithMemory = memoize(getArea);
console.log(getAreaWithMemory(5));

// let getAreaWithMemory = _.memoize(getArea);
// console.log(getAreaWithMemory(4));
