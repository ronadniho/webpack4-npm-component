const merge = require("webpack-merge");
const path = require("path");
const webpackBase = require("./webpack.base.js");
process.env.NODE_ENV = "development";
module.exports = merge(webpackBase, {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, "../"),
  entry: "./src/entry/main-dev.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "build.js",
    publicPath: "/dist/",
  },
  
  devtool: "eval-source-map",
  devServer: {
    publicPath: "/dist/",
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    open: true,
    hot: true,
    progress:true,
    proxy: {
      "^/ts": {
        target: "http://172.16.16.119:8081/",
        pathRewrite: {
          "^/ts": ""
        },
      },
    },
    host: "localhost", // can be overwritten by process.env.HOST
    port: 9090, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
  },
  
});
