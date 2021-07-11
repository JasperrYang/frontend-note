var oBtn = document.getElementById("btn");
/**
 * handle 需要执行的事件
 * wait 事件触发多久后开始执行
 * immediate 控制是第一次执行还是最后一次
 * */
function myDebounce(handle, wait = 1000, immediate = false) {
  let timer = null;
  return function proxy() {
    clearTimeout(timer);
    const init = immediate && !timer;
    // immediate = false 也就是最后一次执行时触发
    timer = setTimeout(() => {
      timer = null;
      !immediate ? handle() : null;
    }, wait);
    // immediate = true 也就是第一次执行时触发
    // 立即执行也需要依赖于 setTimeout 控制时间，当 timer 为空时执行
    init ? handle() : null;
  };
}

function btnClick() {
  console.log("点击了");
}

oBtn.onclick = myDebounce(btnClick, 500, true);
