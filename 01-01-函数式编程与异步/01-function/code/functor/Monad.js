const fs = require("fs");
const fp = require("lodash/fp");

class IO {
  constructor(fn) {
    this._value = fn;
  }

  static of(x) {
    return new IO(() => {
      return x;
    });
  }

  map(fn) {
    return new IO(fp.flowRight(fn, this._value));
  }

  join() {
    return this._value();
  }

  flatMap(fn) {
    return this.map(fn).join();
  }
}
let readFile = function (filename) {
  return new IO(() => {
    return fs.readFileSync(filename, "utf-8");
  });
};
let print = function (x) {
  return new IO(() => {
    console.log(x);
    return x;
  });
};
let result = readFile("package.json").flatMap(fp.toUpper).join();
console.log(result);
