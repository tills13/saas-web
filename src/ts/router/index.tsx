import "react-router-relay"

import * as React from "react"
import * as Relay from "react-relay/classic"
import * as useRelay from "react-router-relay"

import {
  applyRouterMiddleware,
  browserHistory,
  IndexRoute,
  Route,
  Router as ReactRouter
} from "react-router"

import { syncHistoryWithStore } from "react-router-redux"
import { store } from "../store"
import { application, node, viewer } from "../utils/queries"

import Documentation from "routes/documentation"

import Dashboard from "components/dashboard"
import Index from "routes/landing"
import Signup from "routes/landing/signup"
import Test from "routes/test"

import boardRouter from "./boards"
import daemonRouter from "./daemons"
import gameRouter from "./games"
import snakeRouter from "./snakes"

import { renderLoading } from "./utils"

const history = syncHistoryWithStore(browserHistory, store)

export class Router extends React.Component<any, any> {
  render() {
    return (
      <ReactRouter
        history={ history }
        render={ applyRouterMiddleware(useRelay) }
        environment={ Relay.Store }
      >

        <Route
          path="/"
          component={ Dashboard }
          queries={ { viewer } }
          render={ renderLoading(Dashboard) }
        >
          <IndexRoute component={ Index } />

          { boardRouter() }
          { daemonRouter() }
          { gameRouter() }
          { snakeRouter() }

          <Route path="documentation" component={ Documentation } queries={ { viewer } } />
          <Route path="signup" component={ Signup } />
          <Route path="test" component={ Test } queries={ { application } } />
        </Route>
      </ReactRouter>
    )
  }
}
