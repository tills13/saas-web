import { BrowserProtocol, queryMiddleware } from "farce"
import { createFarceRouter, createRender, makeRouteConfig, Route } from "found"
import React from "react"

import Dashboard, { DashboardQuery } from "components/dashboard"
import Documentation, { DocumenationQuery } from "routes/documentation"
import Index from "routes/landing"
import LoginRegister from "routes/LoginRegister"

import CreateBoard, { CreateBoardQuery } from "routes/boards/CreateBoard"
import ViewBoards, { ViewBoardsQuery } from "routes/boards/ViewBoards"

import CreateDaemon from "routes/daemons/CreateDaemon"
import EditDaemon, { EditDaemonQuery } from "routes/daemons/EditDaemon"
import ViewDaemons, { ViewDaemonsQuery } from "routes/daemons/ViewDaemons"

import CreateGame, { CreateGameQuery } from "routes/games/CreateGame"
import EditGame, { EditGameQuery } from "routes/games/EditGame"
import ViewGame, { ViewGameQuery } from "routes/games/ViewGame"
import ViewGames, { ViewGamesQuery } from "routes/games/ViewGames"

import CreateSnake from "routes/snakes/CreateSnake"
import EditSnake, { EditSnakeQuery } from "routes/snakes/EditSnake"
import ViewSnakes, { ViewSnakesQuery } from "routes/snakes/ViewSnakes"

import Test, { TestQuery } from "routes/Test"

import { renderLoading } from "./utils"

export default createFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares: [queryMiddleware],
    render: createRender({}),
    routeConfig: makeRouteConfig(
        <Route Component={Dashboard} path="/" query={DashboardQuery}>
            <Route Component={Index} />
            <Route Component={Documentation} path="documentation" query={DocumenationQuery} />
            <Route Component={LoginRegister} path="register" />
            <Route Component={LoginRegister} path="login" />

            <Route path="boards">
                <Route Component={ViewBoards} query={ViewBoardsQuery} />
                <Route Component={CreateBoard} path="create" query={CreateBoardQuery} />
            </Route>

            <Route path="daemons">
                <Route Component={ViewDaemons} query={ViewDaemonsQuery} />
                <Route Component={CreateDaemon} path="create" />
                <Route Component={EditDaemon} path=":daemonId/edit" query={EditDaemonQuery} />
            </Route>

            <Route path="games">
                <Route Component={ViewGames} query={ViewGamesQuery} />
                <Route Component={CreateGame} path="create" query={CreateGameQuery} />
                <Route Component={ViewGame} path=":gameId" query={ViewGameQuery} />
                <Route Component={EditGame} path=":gameId/edit" query={EditGameQuery} />
            </Route>

            <Route path="snakes">
                <Route Component={ViewSnakes} query={ViewSnakesQuery} />
                <Route Component={CreateSnake} path="create" />
                <Route Component={EditSnake} path=":snakeId/edit" query={EditSnakeQuery} />
            </Route>

            <Route Component={Test} path="test" query={TestQuery} />
        </Route>
    )
})

/*
<Route path=":nodeId" component={ ViewGame } queries={ { node, viewer } } render={ renderLoading(ViewGame) } />
<IndexRoute component={ Boards } queries={ { application } } render={ renderLoading(Boards) } />
<Route path="create" component={ CreateBoard } queries={ { application, viewer } } render={ renderLoading(CreateBoard) } />
<Route path=":nodeId/edit" component={ EditBoard } queries={ { node } } render={ renderLoading(EditBoard) } />
*/
