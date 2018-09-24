import history from "connect-history-api-fallback"
import express from "express"
import proxy from "http-proxy-middleware"
import webpack from "webpack"
import middleware from "webpack-dev-middleware"

import webpackConfig from "./webpack.config"

const app = express()
const compiler = webpack(webpackConfig)
const wdmInstance = middleware(compiler)

app.use(proxy("/api", { target: "http://localhost:3000" }))
app.use(proxy("/static", { target: "http://localhost:3000" }))
app.use(proxy("/graphql", { target: "http://localhost:3000" }))
app.use(proxy("/socket.io", { target: "http://localhost:3001" }))

app.use(history())

app.use(wdmInstance)

app.listen(8080, "0.0.0.0", function () {
  // wdmInstance.waitUntilValid(function (stats) {
  //   console.log(`> ready - ${ stats.hash }`)
  // })
})
