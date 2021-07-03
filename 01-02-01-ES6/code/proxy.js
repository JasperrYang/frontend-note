const person = {
  name: "李四",
  sex: "男",
  age: 18,
};

var obj = new Proxy(person, {
  get: function (target, propKey, receiver) {
    return target[propKey];
  },
  set: function (target, propKey, value, receiver) {
    console.log("value --->", value);
    return target[propKey];
  },
});

obj.name = "jack";
console.log(obj.name);

// 输出
// value---> jack
// 李四
