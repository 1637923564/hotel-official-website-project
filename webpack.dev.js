const path = require("path");

const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    contentBase: "./build"
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: "html-loader", // 实现html文件可访问本地图片
        }]
      },{
      test: /\.(c|sc)ss$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            sourceMap: true
          }
        },
        {
          loader: "sass-loader",
          options: {
            sourceMap: true
          }
        }
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      favicon: "./src/image/ally111.png",
      template: "./src/index.html",
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      filename: "list.html",
      favicon: "./src/image/ally111.png",
      template: "./src/list.html",
      inject: "body"
    }),
    new HtmlWebpackPlugin({
      filename: "activities.html",
      favicon: "./src/image/ally111.png",
      template: "./src/activities.html",
      inject: "body"
    }),
    new HtmlWebpackPlugin({
      filename: "toJoin.html",
      favicon: "./src/image/ally111.png",
      template: "./src/toJoin.html",
      inject: "body"
    }),
    new HtmlWebpackPlugin({
      filename: "search.html",
      favicon: "./src/image/ally111.png",
      template: "./src/search.html",
      inject: "body"
    }),
    new HtmlWebpackPlugin({
      filename: "head.html",
      template: "./src/partial/head.html",
      chunks: [""] // 选择需要引入的某些块，传空为不引入
    }),
    new HtmlWebpackPlugin({
      filename: "foot.html",
      template: "./src/partial/foot.html",
      chunks: [""]
    })
  ],
  output: {
    filename: "[name][hash].js",
    path: path.resolve(__dirname, "build")
  }
});