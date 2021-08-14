const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const myPlugin = require("./MyPlugin.js");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    // publicPath: "dist/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            exclude: /node_modules/,
          },
        },
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.png$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024, // 对于小于10kb的图片资源使用 url-loader, 大于则使用 file-loader
          },
        },
      },
      {
        test: /.md$/,
        use: ["html-loader", "./md-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "webpack plugin sample",
      meta: {
        viewport: "width=device-width",
      },
      template: "./src/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "about.html",
    }),
    new CopyWebpackPlugin({
      patterns: ["public"],
    }),
    new myPlugin(),
  ],
};
