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
    path: path.resolve(__dirname, "./dist"),
    filename: "build.js",
    publicPath: "/dist/",
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
});
