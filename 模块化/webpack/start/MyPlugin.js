module.exports = class MyPlugin {
  apply(compiler) {
    // 此方法在webpack启动时自动被调用，compile配置对象，配置信息

    console.log("MyPlugin 启动");

    // 通过hooks属性访问钩子emit
    // 参考：https://webpack.docschina.org/api/compiler-hooks/
    // tap方法注册钩子函数(参数1:插件名称，参数2:挂载到钩子上的函数)

    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // compilation 可以理解为此次打包的上下文,所有打包过程产生的结果都会放到这个对象中
      // compilation.assets属性是个对象，用于获取即将写入目录当中的资源文件信息

      for (const name in compilation.assets) {
        // console.log("文件名称:",name); 如图
        // console.log("文件内容:",compilation.assets[name].source());

        if (name.endsWith(".js")) {
          //获取内容
          const contents = compilation.assets[name].source();

          //替换内容
          const withoutComments = contents.replace(/\/\*\*+\*\//g, "");

          //覆盖老内容
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length, //返回内容的大小，webpack要求必须加
          };
        }
      }
    });
  }
};
