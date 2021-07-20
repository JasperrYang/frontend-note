// grunt 入口文件，用于定义需要 grunt 自动执行的任务
// 需要导出一个函数，此函数接收一个 grunt 的形参，内部提供一些创建任务时可以用到的 api
module.exports = (grunt) => {
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.initConfig({
    clean: {
      temp: "temp/**",
    },
  });
  // grunt.initConfig({
  //   foo: {
  //     options: {
  //       sex: "男",
  //     },
  //     name: "jasper",
  //     age: 25,
  //   },
  // });

  // // 注册一个名为 foo 的任务
  // // grunt.registerTask("foo", () => {
  // //   console.log(grunt.config().foo.name);
  // // });
  // // 注册一个名为 bar, 描述为 任务描述 的任务
  // grunt.registerTask("bar", "任务描述", () => {
  //   console.log("other task");
  // });
  // // 注册一个 default 任务, 执行时不需要指定任务名称 yarn grunt
  // // grunt.registerTask("default", () => {
  // //   console.log("default task");
  // // });
  // // 注册一个 default 任务, 依次执行 foo 和 bar 任务
  // grunt.registerTask("default", ["foo", "bar"]);
  // // 注册一个 async-task 的异步任务
  // grunt.registerTask("async-task", function () {
  //   // 声明这是一个异步任务
  //   this.async();
  //   setTimeout(() => {
  //     console.log("async task");
  //   }, 1000);
  // });
  // // 多目标
  // grunt.registerMultiTask("foo", function () {
  //   console.log(this.options());
  //   console.log(`target: ${this.target}, data: ${this.data}`);
  // });
};
