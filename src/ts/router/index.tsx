import { BrowserProtocol, queryMiddleware } from "farce"
import { createFarceRouter, createRender, makeRouteConfig, Route } from "found"
import React from "react"
import { graphql } from "react-relay"

import RouteContainer from "components/container/route_container"
import Dashboard from "components/dashboard"
import Documentation from "routes/documentation"
import Index from "routes/landing"
import Signup from "routes/signup"

import CreateBoard, { CreateBoardQuery } from "routes/boards/CreateBoard"
import ViewBoards, { ViewBoardsQuery } from "routes/boards/ViewBoards"

import CreateDaemon from "routes/daemons/CreateDaemon"
import EditDaemon, { EditDaemonQuery } from "routes/daemons/EditDaemon"
import ViewDaemons, { ViewDaemonsQuery } from "routes/daemons/ViewDaemons"

import CreateGame, { CreateGameQuery } from "routes/games/CreateGame"
import EditGame, { EditGameQuery } from "routes/games/EditGame"
import ViewGames, { ViewGamesQuery } from "routes/games/ViewGames"

import CreateSnake from "routes/snakes/CreateSnake"
import EditSnake, { EditSnakeQuery } from "routes/snakes/EditSnake"
import ViewSnakes, { ViewSnakesQuery } from "routes/snakes/ViewSnakes"

import Test, { TestQuery } from "routes/Test"

import { renderLoading } from "./utils"

const DashboardQuery = graphql`
  query router_Dashboard_Query {
    viewer {
      ...Dashboard_viewer
      ...documentation_viewer
    }
  }
`

export default createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [ queryMiddleware ],
  render: createRender({}),
  routeConfig: makeRouteConfig(
    <Route Component={ Dashboard } path="/" query={ DashboardQuery }>
      <Route Component={ Index } />
      <Route path="documentation" Component={ Documentation } />
      <Route path="signup" Component={ Signup } />

      <Route Component={ RouteContainer } render={ renderLoading }>
        <Route path="boards">
          <Route Component={ ViewBoards } query={ ViewBoardsQuery } render={ renderLoading } />
          <Route Component={ CreateBoard } path="create" query={ CreateBoardQuery } render={ renderLoading } />
        </Route>
        <Route path="daemons">
          <Route Component={ ViewDaemons } query={ ViewDaemonsQuery } render={ renderLoading } />
          <Route Component={ CreateDaemon } path="create" render={ renderLoading } />
          <Route Component={ EditDaemon } path=":daemonId/edit" query={ EditDaemonQuery } render={ renderLoading } />
        </Route>
        <Route path="games">
          <Route Component={ ViewGames } query={ ViewGamesQuery } render={ renderLoading } />
          <Route Component={ CreateGame } path="create" query={ CreateGameQuery } render={ renderLoading } />
          <Route Component={ EditGame } path=":gameId/edit" query={ EditGameQuery } render={ renderLoading } />
        </Route>
        <Route path="snakes">
          <Route Component={ ViewSnakes } query={ ViewSnakesQuery } render={ renderLoading } />
          <Route Component={ CreateSnake } path="create" render={ renderLoading } />
          <Route Component={ EditSnake } path=":snakeId/edit" query={ EditSnakeQuery } render={ renderLoading } />
        </Route>
        <Route Component={ Test } path="test" query={ TestQuery } />
      </Route>
    </Route>
  )
})

/*
<Route path=":nodeId" component={ ViewGame } queries={ { node, viewer } } render={ renderLoading(ViewGame) } />
<IndexRoute component={ Boards } queries={ { application } } render={ renderLoading(Boards) } />
<Route path="create" component={ CreateBoard } queries={ { application, viewer } } render={ renderLoading(CreateBoard) } />
<Route path=":nodeId/edit" component={ EditBoard } queries={ { node } } render={ renderLoading(EditBoard) } />
*/
