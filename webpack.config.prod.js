var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HTMLWebpackPlugin = require("html-webpack-plugin");
var nodeExternals = require("webpack-node-externals");

const environment = process.env.NODE_ENV || "production";
const API_URL =
  console.log(`building for ${ environment }, ${ __dirname }`);

module.exports = {
  context: __dirname,
  target: "web",
  entry: [
    "./src/ts/index.tsx",
  ],
  externals: {
    "jquery": "$",
    "lodash": "_",
    "react": "React",
    "react-dom": "ReactDOM"
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ["awesome-typescript-loader"],
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: /node_modules/
      }, {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('css!sass')
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
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      __API_ROOT__: JSON.stringify(`${ environment === "production" ? process.env.API_ROOT : "http://localhost:3000" }/api`)
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
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, "styles")
    ]
  }
};

