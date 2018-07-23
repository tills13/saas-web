import React from "react"

import {
  applyRouterMiddleware,
  browserHistory,
  IndexRoute,
  Route,
  Router as ReactRouter
} from "react-router"

import CreateBoard from "../routes/boards/create"
import EditBoard from "../routes/boards/edit"
import Boards from "../routes/boards/list"

import RouteContainer from "components/container/route_container"

import { application, node, viewer } from "../utils/queries"
import { renderLoading } from "./utils"

export default () => {
  return (
    <Route path="boards" component={ RouteContainer } render={ renderLoading(RouteContainer) }>
      <IndexRoute component={ Boards } queries={ { application } } render={ renderLoading(Boards) } />
      <Route path="create" component={ CreateBoard } queries={ { application, viewer } } render={ renderLoading(CreateBoard) } />
      <Route path=":nodeId/edit" component={ EditBoard } queries={ { node } } render={ renderLoading(EditBoard) } />
    </Route>
  )
}
