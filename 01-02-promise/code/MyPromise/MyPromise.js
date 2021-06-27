/**
 * promise 实现
 * 1 传入执行器，立即执行
 * 2 三种状态，成功 fulfilled 失败 rejected 等待 pending，且不可更改
 * 3 resolve和reject函数用来更改状态
 * 4 then方法有两个回调函数 内部做的事情就判断状态 如果状态是成功 调用成功的回调函数 如果状态是失败 调用失败回调函数
 *   then方法是可以被链式调用的，后面then方法的回调函数拿到值的是上一个then方法的回调函数的返回值
 *
 */
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  status = PENDING;
  value = undefined;
  reason = undefined;

  resolve = (value) => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
  };

  reject = (reason) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
  };

  then(successCallback, failedCallback) {
    if (this.status === FULFILLED) {
      successCallback(this.value);
    } else if (this.status === REJECTED) {
      failedCallback(this.reason);
    }
  }
}

module.exports = MyPromise;
