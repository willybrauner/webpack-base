const paths = require("../paths");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  /**
   * Mode
   * Set the mode to development or production.
   */
  mode: "development",

  /**
   * Devtool
   * Control how source maps are generated.
   */
  devtool: "inline-source-map",

  plugins: [
    /**
     * Friendly error
     * @doc https://github.com/geowarin/friendly-errors-webpack-plugin
     */
    new FriendlyErrorsPlugin({
      clearConsole: true
    }),

    /**
     * Hot reload
     */
    new webpack.HotModuleReplacementPlugin(),

    /**
     * Generate Html webpack plugin
     */
    new HtmlWebpackPlugin({
      title: "Webpack base",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/template.html",
      filename: "index.html"
    })
  ],

  /**
   * DevServer
   * Spin up a server for quick development.
   */
  devServer: {
    contentBase: paths.dist,
    open: true,
    compress: true,
    hot: true,
    port: 3000,
    writeToDisk: false,
    historyApiFallback: true,

    // display error overlay on screen
    overlay: true,

    stats: {
      all: false,
      assets: true
    },

    // friendly webpack error
    // pass to true if you don't want to print compile file in the console
    quiet: true
  }
});
