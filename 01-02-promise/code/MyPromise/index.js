const MyPromise = require("./MyPromise");

let promise = new MyPromise((resolve, reject) => {
  resolve("true");
  // setTimeout(() => {
  //   resolve("true");
  // }, 2000);
  // reject("false");
});

// function others() {
//   return new MyPromise((resolve, reject) => {
//     resolve("others");
//   });
// }

// promise
//   .then((value) => {
//     console.log(value);
//     return others();
//   })
//   .then((value) => {
//     console.log(value);
//   });

let p1 = promise.then((value) => {
  console.log(value);
  return p1;
});

p1.then(
  (value) => {
    console.log(value);
  },
  (reason) => {
    console.log(reason);
  }
);
