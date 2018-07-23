import React from "react"

import {
  applyRouterMiddleware,
  browserHistory,
  IndexRoute,
  Route,
  Router as ReactRouter
} from "react-router"

import CreateSnake from "routes/snakes/create"
import EditSnake from "routes/snakes/edit"
import SnakeList from "routes/snakes/list"

import RouteContainer from "components/container/route_container"

import { application, node, viewer } from "../utils/queries"
import { renderLoading } from "./utils"

export default () => {
  return (
    <Route path="snakes" component={ RouteContainer } render={ renderLoading(RouteContainer) }>
      <IndexRoute component={ SnakeList } queries={ { application } } render={ renderLoading(SnakeList) } />
      <Route path="create" component={ CreateSnake } render={ renderLoading(CreateSnake) } />
      <Route path=":nodeId/edit" component={ EditSnake } queries={ { node } } render={ renderLoading(EditSnake) } />
    </Route>
  )
}
