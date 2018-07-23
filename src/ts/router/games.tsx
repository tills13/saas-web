import React from "react"

import {
  applyRouterMiddleware,
  browserHistory,
  IndexRoute,
  Route,
  Router as ReactRouter
} from "react-router"

import { application, node, viewer } from "../utils/queries"

import CreateGame from "../routes/games/create"
import EditGame from "../routes/games/edit"
import GameList from "../routes/games/list"
import ViewGame from "../routes/games/view"

import RouteContainer from "components/container/route_container"

import { renderLoading } from "./utils"

export default () => {
  return (
    <Route
      path="games"
      component={ RouteContainer }
      render={ renderLoading(RouteContainer) }
    >
      <IndexRoute component={ GameList } queries={ { application } } render={ renderLoading(GameList) } />
      <Route path="create" component={ CreateGame } queries={ { application } } render={ renderLoading(CreateGame) } />
      <Route path=":nodeId" component={ ViewGame } queries={ { node, viewer } } render={ renderLoading(ViewGame) } />
      <Route path=":nodeId/edit" component={ EditGame } queries={ { application, node } } render={ renderLoading(EditGame) } />
    </Route>
  )
}
