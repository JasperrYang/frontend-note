const MyPromise = require("./MyPromise");

let promise = new MyPromise((resolve, reject) => {
  resolve("true");
  reject("false");
});

promise.then(
  (value) => console.log(value),
  (reason) => console.log(reason)
);
