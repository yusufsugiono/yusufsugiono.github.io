const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
          use: ["style-loader", "css-loader"],
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
    ],
    devServer: {
      static: "./dist",
      open: true,
      port: 3000,
    },
  };
};
