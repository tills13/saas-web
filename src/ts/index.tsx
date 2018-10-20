import "../styles/style.scss"

import { Resolver } from "found-relay"
import React from "react"
import ReactDOM from "react-dom"
import environment from "relay/environment"

import Router from "./router"

ReactDOM.render(
  <Router resolver={ new Resolver(environment) } />,
  document.getElementById("application")
)
