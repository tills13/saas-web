import * as React from "react"

import {
  applyRouterMiddleware,
  browserHistory,
  IndexRoute,
  Route,
  Router as ReactRouter
} from "react-router"

import CreateDaemon from "../routes/daemons/create"
import EditDaemon from "../routes/daemons/edit"
import Daemons from "../routes/daemons/list"

import RouteContainer from "components/container/route_container"

import { application, node, viewer } from "../utils/queries"
import { renderLoading } from "./utils"

export default () => {
  return (
    <Route path="daemons" component={ RouteContainer } render={ renderLoading(RouteContainer) }>
      <IndexRoute component={ Daemons } queries={ { application } } render={ renderLoading(Daemons) } />
      <Route path="create" component={ CreateDaemon } render={ renderLoading(CreateDaemon) } />
      <Route path=":nodeId/edit" component={ EditDaemon } queries={ { node } } render={ renderLoading(EditDaemon) } />
    </Route>
  )
}
