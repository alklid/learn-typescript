// webpack.config.js
// `webpack` command will pick up this config setup by default
var path = require("path");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "none",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "eval-cheap-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader"],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
