let p1 = setTimeout(function timer1() {
  console.log("p1");
}, 3000);

let p2 = setTimeout(function timer1() {
  console.log("p2");
}, 2000);

let p3 = setTimeout(function timer1() {
  console.log("p3");
}, 1000);

Promise.all([p1, p2, p3]).then(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.log(error);
  }
);
// 输出
// p1
// p2
// p3
