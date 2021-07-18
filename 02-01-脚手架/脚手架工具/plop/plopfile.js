// plop 入口文件，需要导出一个函数
// 此函数接收一个 plop 对象，用户创建生成器任务

module.exports = (plop) => {
  plop.setGenerator("component", {
    description: "create component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "component name",
        default: "myComponent",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{name}}/index.js",
        templateFile: "templates/component.js.hbs",
      },
      {
        type: "add",
        path: "src/components/{{name}}/index.css",
        templateFile: "templates/component.css.hbs",
      },
      {
        type: "add",
        path: "src/components/{{name}}/index.html",
        templateFile: "templates/component.html.hbs",
      },
    ],
  });
};
