const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    mode: argv.mode, // ikut dari CLI (--mode)
    entry: "./src/assets/js/script.js",
    output: {
      filename: isProd ? "main.[contenthash].js" : "main.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      publicPath: "/",
    },
    devtool: isProd ? false : "inline-source-map",
    module: {
      rules: [
        // Babel loader untuk JS
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        // CSS loader
        {
          test: /\.css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        // Asset loader (gambar)
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
          generator: {
            filename: "img/[name][hash][ext][query]",
          },
        },
        // HTML loader
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: "[name].[contenthash].css",
            }),
          ]
        : []),
    ],
    devServer: {
      static: "./dist",
      open: true,
      port: 3000,
    },
  };
};
