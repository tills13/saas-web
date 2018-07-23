const history = require("connect-history-api-fallback")
const proxy = require("http-proxy-middleware")
const convert = require("koa-connect")
const path = require("path")
const webpack = require("webpack")

const HTMLWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const environment = process.env.NODE_ENV || "production"
const devMode = environment === "development"

console.log(`building for ${ environment }, ${ __dirname }`)

const api = `${ environment === "production" ? "https://saas.sbstn.ca" : "http://localhost:3000" }/api`
const htmlTemplate = `src/assets/index${ environment === "production" ? ".prod" : ".dev" }.html`

module.exports = {
  context: __dirname,
  target: "web",
  entry: [ "react-hot-loader/patch", "babel-polyfill", "./src/ts/index.tsx" ],
  mode: devMode ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          { loader: "ts-loader", options: { transpileOnly: true } }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          {
            loader: "sass-resources-loader",
            options: {
              resources: [
                "./src/styles/variables.scss",
                "./src/styles/mixins.scss"
              ]
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)(\?(v=)?(\d|\.)+)?$/,
        use: [ "file-loader" ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "[id].bundle.js"
  },
  plugins: [
    new webpack.DefinePlugin({ __API_ROOT__: JSON.stringify(api) }),
    new MiniCssExtractPlugin({
      filename: "style.css",
      chunkFilename: "[id].css"
    }),
    new HTMLWebpackPlugin({
      title: "SaaS",
      template: htmlTemplate
    })
  ],
  resolve: {
    extensions: [ ".js", ".jsx", ".ts", ".tsx", ".scss", ".html" ],
    modules: [ "node_modules", "./src", "./src/ts", "./src/styles", "./src/assets/" ]
  }
}

module.exports.serve = {
  content: [ __dirname ],
  add (app) {
    app.use(convert(proxy("/api", { target: "http://localhost:3000" })))
    app.use(convert(proxy("/static", { target: "http://localhost:3000" })))
    app.use(convert(proxy("/graphql", { target: "http://localhost:3000" })))
    app.use(convert(proxy("/socket.io", { target: "http://localhost:3001" })))

    app.use(convert(history()))
  }
}
