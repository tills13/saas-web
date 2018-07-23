import "../styles/style.scss"

import javascript from "highlight.js/lib/languages/javascript"
import React from "react"
import ReactDOM from "react-dom"

import * as utils from "./utils"

import { Map } from "immutable"
import { AppContainer } from "react-hot-loader"
import { Provider } from "react-redux"
import { registerLanguage } from "react-syntax-highlighter/dist/light"
import { Router } from "./router"
import { store } from "./store"

registerLanguage("javascript", javascript)

store.subscribe(() => {
  (window as any)[ "DEBUG" ] = false;
  (window as any)[ "state" ] = Map({ ...store.getState() }).toJS();
  (window as any)[ "DEBUG" ] && console.log((window as any)[ "state" ])
})

const render = (Component: any) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={ store }>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById("application")
  )
}

// utils.setupRelay()

render(Router)

// declare var module: any

// if (module.hot) {
//   module.hot.accept("./router", () => render(Router))
// }
