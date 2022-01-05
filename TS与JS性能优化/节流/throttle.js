function scrollFn() {
  console.log("滚动了");
}
/**
 * wait 频率
 * now 现在时间
 * pervious 上次执行时间
 * wait - (now - previous)
 * 如上述计算结果是大于0的，就意味着当前操作是一个高频的，我们就要想办法让他不去执行handle
 * 如果小于0，那就是一个非高频的，那么就可以直接触发handler
 * */
function myThrottle(handle, wait = 1000) {
  let previous = 0; // 上一次执行时间
  let timer = null;
  return function proxy() {
    let now = new Date(); // 当前次执行时间
    let interval = wait - (now - previous);
    if (interval <= 0) {
      // 非高频次可以立即执行
      // 防止浏览器监听触发的事件和我们节流的时间重合，只走第一个if
      clearTimeout(timer);
      timer = null;
      handle();
      previous = new Date();
    } else if (!timer) {
      // 当系统中已经有一个定时器再等待，那么就不需要再次开启一个定时器
      // 高频次，等待 interval 执行
      timer = setTimeout(() => {
        clearTimeout(timer); // 是清除了定时器，但 timer 值还在
        timer = null;
        handle();
        previous = new Date();
      }, interval);
    }
  };
}

window.onscroll = myThrottle(scrollFn, 2000);
