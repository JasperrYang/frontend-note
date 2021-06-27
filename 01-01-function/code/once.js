function once(fn) {
  let done = false;
  return function () {
    if (!done) {
      done = true;
      return fn.apply(this, arguments);
    }
  };
}
let pay = once((money) => {
  console.log(`支付了${money}`);
});

pay(10);
pay(10);
pay(10);
