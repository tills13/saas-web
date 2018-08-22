import "../styles/style.scss"

import { Resolver } from "found-relay"
import javascript from "highlight.js/lib/languages/javascript"
import React from "react"
import ReactDOM from "react-dom"

import { registerLanguage } from "react-syntax-highlighter/dist/light"
import Router from "router"

import environment from "relay/environment"

registerLanguage("javascript", javascript)

ReactDOM.render(
  <Router resolver={ new Resolver(environment) } />,
  document.getElementById("application")
)
