const fp = require("lodash/fp");
const fs = require("fs");
const { task } = require("folktale/concurrency/task");

// class IO {
//   constructor(fn) {
//     this._value = fn;
//   }

//   map(fn) {
//     return new IO(fp.flowRight(fn, this._value));
//   }

//   static of(x) {
//     return new IO(() => x);
//   }
// }
// let path = IO.of(process).map((p) => p.execPath);
// console.log(path._value());
function readFile(filename) {
  return task((resolve) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) {
        resolve.reject(err);
      }
      resolve.resolve(data);
    });
  });
}

readFile("package.json")
  .run()
  .listen({
    onRejected: (err) => {
      console.log(err);
    },
    onResolved: (data) => {
      console.log(data);
    },
  });
