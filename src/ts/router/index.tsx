import { BrowserProtocol, queryMiddleware } from "farce"
import { createFarceRouter, createRender, makeRouteConfig, Route } from "found"
import React from "react"

import Dashboard, { DashboardQuery } from "components/Dashboard"
import RouteContainer from "components/RouteContainer"

import Documentation, { DocumenationQuery } from "routes/Documentation"
import Index from "routes/Landing"
import LoginRegister from "routes/LoginRegister"

import CreateBoard, { CreateBoardQuery } from "routes/CreateBoard"
import ViewBoards, { ViewBoardsQuery } from "routes/ViewBoards"

import CreateDaemon from "routes/CreateDaemon"
import EditDaemon, { EditDaemonQuery } from "routes/EditDaemon"
import ViewDaemons, { ViewDaemonsQuery } from "routes/ViewDaemons"

import CreateGame, { CreateGameQuery } from "routes/CreateGame"
import EditGame, { EditGameQuery } from "routes/EditGame"
import ViewGame, { ViewGameQuery } from "routes/ViewGame"
import ViewGames, { ViewGamesQuery } from "routes/ViewGames"

import CreateSnake from "routes/CreateSnake"
import EditSnake, { EditSnakeQuery } from "routes/EditSnake"
import ViewSnakes, { viewSnakesPrepareVariables, ViewSnakesQuery } from "routes/ViewSnakes"

import { renderLoading } from "./utils"

export default createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [ queryMiddleware ],
  render: createRender({}),
  routeConfig: makeRouteConfig(
    <Route Component={ Dashboard } path="/" query={ DashboardQuery }>
      <Route Component={ Index } />
      <Route Component={ Documentation } path="documentation" query={ DocumenationQuery } />
      <Route Component={ LoginRegister } path=":mode(login|register)" />

      <Route Component={ RouteContainer }>
        <Route path="boards">
          <Route Component={ ViewBoards } query={ ViewBoardsQuery } />
          <Route Component={ CreateBoard } path="create" query={ CreateBoardQuery } />
        </Route>

        <Route path="daemons">
          <Route Component={ ViewDaemons } query={ ViewDaemonsQuery } />
          <Route Component={ CreateDaemon } path="create" />
          <Route Component={ EditDaemon } path=":daemonId/edit" query={ EditDaemonQuery } />
        </Route>

        <Route path="games">
          <Route Component={ ViewGames } query={ ViewGamesQuery } />
          <Route Component={ CreateGame } path="create" query={ CreateGameQuery } />
          <Route Component={ ViewGame } path=":gameId" query={ ViewGameQuery } />
          <Route Component={ EditGame } path=":gameId/edit" query={ EditGameQuery } />
        </Route>

        <Route path="snakes">
          <Route
            Component={ ViewSnakes }
            prepareVariables={ viewSnakesPrepareVariables }
            query={ ViewSnakesQuery }
          />
          <Route Component={ CreateSnake } path="create" />
          <Route
            Component={ ViewSnakes }
            path=":snakeId"
            prepareVariables={ viewSnakesPrepareVariables }
            query={ ViewSnakesQuery }
          />
          <Route Component={ EditSnake } path=":snakeId/edit" query={ EditSnakeQuery } />
        </Route>
      </Route>
    </Route>
  )
})
