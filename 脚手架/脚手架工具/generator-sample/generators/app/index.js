// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require("yeoman-generator");

// 起步
// module.exports = class extends Generator {
//   writing() {
//     // Yeoman 自动在生成文件阶段调用此方法
//     this.fs.write(this.destinationPath("temp.txt"), Math.random().toString());
//   }
// };

// 模板
// module.exports = class extends Generator {
//   writing() {
//     // 模板文件路径
//     const tmpl = this.templatePath("foo.txt");
//     // 输出文件路径
//     const output = this.destinationPath("foo.txt");
//     // 模板数据上下文
//     const context = { title: "hello", success: true };
//     this.fs.copyTpl(tmpl, output, context);
//   }
// };

// 接受输入
module.exports = class extends Generator {
  prompting() {
    // Yeoman 在询问用户环节会自动调用此方法
    // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问
    return this.prompt([
      {
        type: "input", // 用户输入类
        name: "title", // 接收参数的键
        message: "message title", // 提示
        default: "hello", // 默认值
      },
      {
        type: "input", // 用户输入类
        name: "success", // 接收参数的键
        message: "message status", // 提示
        default: false, // 默认值
      },
    ]).then((answer) => {
      this.answer = answer;
    });
  }
  writing() {
    // 模板文件路径
    const tmpl = this.templatePath("foo.txt");
    // 输出文件路径
    const output = this.destinationPath("input.txt");
    // // 模板数据上下文
    // const context = { title: "hello", success: true };
    this.fs.copyTpl(tmpl, output, this.answer);
  }
};
