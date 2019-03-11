const merge = require("webpack-merge");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CleanWebpackPlugin = require('clean-webpack-plugin');

const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(c|sc)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: loader => [
                autoprefixer({
                  browers: ["> 0.15% in CN"]
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|png|jpg|gif)$/i,
        use: [ "image-webpack-loader" ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name][hash].css",
      chunkFilename: "css/[id][hash].css"
    }),
    new HtmlWebpackPlugin({
      filename: "views/index.html",
      template: "./src/index.html",
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      filename: "views/list.html",
      template: "./src/list.html",
      inject: "body"
    }),
    new HtmlWebpackPlugin({
      filename: "views/activities.html",
      template: "./src/activities.html",
      inject: "body"
    }),
    new HtmlWebpackPlugin({
      filename: "views/toJoin.html",
      template: "./src/toJoin.html",
      inject: "body"
    }),
    new HtmlWebpackPlugin({
      filename: "views/search.html",
      template: "./src/search.html",
      inject: "body"
    }),
    new HtmlWebpackPlugin({
      filename: "views/partials/head.html",
      template: "./src/partial/head.html",
      chunks: [""] // 选择需要引入的某些块，传空为不引入
    }),
    new HtmlWebpackPlugin({
      filename: "views/partials/foot.html",
      template: "./src/partial/foot.html",
      chunks: [""]
    })
  ],
  optimization: {
    minimizer: [
      new UglifyjsWebpackPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCssAssetsWebpackPlugin({}),
    ]
  },
  output: {
    filename: "js/[name][hash].js",
    path: path.resolve(__dirname, "dist")
  }
})