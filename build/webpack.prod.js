const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackBase = require("./webpack.base.js");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

process.env.NODE_ENV = "production";
module.exports = merge(webpackBase, {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, "../"),
  entry: "./src/entry/main-pro.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "Heg-Components.js",
    publicPath: "/dist/",
    library: "Heg-Components", // 指定的就是你使用require时的模块名
    libraryTarget: "umd", // 指定输出格式
    umdNamedDefine: true, // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false,
    //   },
    // }),
    // new webpack.LoaderOptionsPlugin({
    //   minimize: true,
    // }),
    // new webpack.DefinePlugin({
    //   "process.env": {
    //     NODE_ENV: '"production"',
    //   },
    // }),
  ],
});
