const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
// const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const environment = process.env.NODE_ENV || "production";
console.log(`building for ${ environment }, ${ __dirname }`);

module.exports = {
  context: __dirname,
  target: 'web',
  devServer: {
    contentBase: "./build",
    historyApiFallback: true,
    host: "0.0.0.0",
    inline: true,
    disableHostCheck: true,
    port: 8000,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false
      },
      "/static": {
        target: "http://localhost:3000",
        secure: false
      },
      "/graphql": {
        target: "http://localhost:3000",
        secure: false
      },
      "/socket.io": {
        target: "http://127.0.0.1:3001",
        secure: false
      }
    },
    watchOptions: { poll: true },
    stats: { colors: true }
  },
  // devtool: "source-map",
  entry: [
    "babel-polyfill",
    // "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:8000",
    // "webpack/hot/only-dev-server",
    "./src/ts/index.tsx",
  ],
  module: {
    loaders: [
      {
        test: /\.[tj]sx?$/,
        loaders: ["awesome-typescript-loader"],
        include: [path.resolve(__dirname, "src")],
        exclude: /node_modules/
      }, {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('css!sass!sass-resources')
      }, {
        test: /\.(ttf|eot|woff|woff2|svg)(\?(v=)?(\d|\.)+)?$/,
        loader: 'file-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "[id].bundle.js"
  },
  plugins: [
    // new TsConfigPathsPlugin(),
    // new BabelRelayPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __API_ROOT__: JSON.stringify(`${ environment === "production" ? "https://saas.sbstn.ca" : "http://localhost:3000" }/api`)
    }),
    new ExtractTextPlugin('style.css'),
    new HTMLWebpackPlugin({
      title: 'SaaS',
      template: `src/assets/index${ environment === "production" ? ".prod" : ".dev" }.html`
    })
  ],
  resolve: {
    extensions: ["", ".js", ".jsx", ".ts", ".tsx", ".scss", ".html"],
    modulesDirectories: ["node_modules", "./src", "./src/ts", "./src/styles", "./src/assets/"]
  },
  sassResources: [
    './src/styles/variables.scss',
    './src/styles/mixins.scss'
  ]
};

