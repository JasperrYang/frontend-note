const _ = require("lodash");

function getSum(a, b, c) {
  return a + b + c;
}

function curry(func) {
  return function curriedFn(...args) {
    if (args.length < func.length) {
      return function () {
        return curriedFn(...args.concat(Array.from(arguments)));
      };
    }
    return func(...args);
  };
}
let curried = curry(getSum);
console.log(curried(1)(2)(3));
console.log(curried(1, 2)(3));

// let curried = _.curry(getSum);
// curried(1)(2)(3);
// curried(1, 2)(3);
