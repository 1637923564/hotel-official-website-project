const path = require("path");

module.exports = {
  entry: "./src/js/index.js",
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              outputPath: "font",
              publicPath: "font"
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 15000,
              outputPath: "img",
              publicPath: "img"
            }
          }
        ]
      }
    ]
  }
};