import "../styles/style.scss"

import javascript from "highlight.js/lib/languages/javascript"
import React from "react"
import { Resolver } from "found-relay"
import ReactDOM from "react-dom"

import * as utils from "utils"

import { Map } from "immutable"
import { AppContainer } from "react-hot-loader"
import { Provider } from "react-redux"
import { registerLanguage } from "react-syntax-highlighter/dist/light"
import Router from "router"
import { store } from "store"

import environment from "relay/environment"

registerLanguage("javascript", javascript)

// store.subscribe(() => {
//   (window as any)[ "DEBUG" ] = false;
//   (window as any)[ "state" ] = Map({ ...store.getState() }).toJS();
//   (window as any)[ "DEBUG" ] && console.log((window as any)[ "state" ])
// })

ReactDOM.render(
  <Router resolver={ new Resolver(environment) } />,
  document.getElementById("application")
)
