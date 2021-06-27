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
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  status = PENDING;
  value = undefined;
  reason = undefined;
  successCallback = [];
  failedCallback = [];

  resolve = (value) => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
    // this.successCallback && this.successCallback(this.value);
    while (this.successCallback.length)
      this.successCallback.shift()(this.value);
  };

  reject = (reason) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    // this.failedCallback && this.failedCallback(this.reason);
    while (this.failedCallback.length) this.failedCallback.shift()(this.reason);
  };

  then(successCallback, failedCallback) {
    // 参数可选
    successCallback = successCallback ? successCallback : (value) => value;
    // 参数可选
    failedCallback = failedCallback
      ? failedCallback
      : (reason) => {
          throw reason;
        };
    const promise = new MyPromise((resolve, reject) => {
      try {
        if (this.status === FULFILLED) {
          setTimeout(() => {
            let result = successCallback(this.value);
            resolvePromise(promise, result, resolve, reject);
          }, 0);
        } else if (this.status === REJECTED) {
          failedCallback(this.reason);
        } else {
          // 等待状态：异步函数
          this.successCallback.push(successCallback);
          this.failedCallback.push(failedCallback);
        }
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  static all(array) {
    let result = [];
    let count = 0;
    function addDate(index, data) {
      result[index] = data;
      count++;
      if (count === array.length) {
        resolve(result);
      }
    }

    array.forEach((element, index) => {
      if (element instanceof MyPromise) {
        element.then(
          (value) => addDate(index, value),
          (reason) => reject(reason)
        );
      } else {
        addDate(index, element);
      }
    });
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }

  finally(callback) {
    return this.then(
      (value) => {
        return MyPromise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }

  catch(failCallback) {
    return this.then(undefined, failCallback);
  }
}

function resolvePromise(promise, result, resolve, reject) {
  if (promise === result) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if (result instanceof MyPromise) {
    result.then(resolve, reject);
  } else {
    resolve(result);
  }
}

module.exports = MyPromise;
