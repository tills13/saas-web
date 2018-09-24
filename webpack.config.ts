import path from "path"
import webpack from "webpack"

import HTMLWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

const environment = process.env.NODE_ENV || "production"
const devMode = environment === "development"

console.log(`building for ${ environment }, ${ __dirname }`)

const api = `${ environment === "production" ? "https://saas.sbstn.ca" : "http://localhost:3000" }/api`
const htmlTemplate = `src/assets/index${ environment === "production" ? ".prod" : ".dev" }.html`
const externals = environment === "production" ? { "lodash": "_", "react": "React", "react-dom": "ReactDOM" } : undefined

const config: webpack.Configuration = {
  context: __dirname,
  target: "web",
  entry: [ "react-hot-loader/patch", "babel-polyfill", "./src/ts/index.tsx" ],
  externals,
  mode: devMode ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [ "babel-loader" ]
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
                "./src/styles/_breakpoint.scss"
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

export default config
