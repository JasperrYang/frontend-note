// 同步
console.log("begin");

function output() {
  console.log("this is output function");
}
output();

console.log("end");
// 输出
// begin
// this is output function
// end

// 异步
console.log("begin");

setTimeout(function timer1() {
  console.log("timer1 invoke");
}, 3000);

setTimeout(function timer2() {
  console.log("timer2 invoke");

  setTimeout(function inner() {
    console.log("inner invoke");
  }, 1000);
}, 1000);

console.log("end");
// 输出
// begin
// end
// timer2 invoke
// inner invoke
// timer1 invoke
