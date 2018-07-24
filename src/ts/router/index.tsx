import { createBrowserRouter, makeRouteConfig, Route } from "found"
import React from "react"
import { graphql } from "react-relay"

import Dashboard from "../components/dashboard"
import Index from "../routes/landing"

import { store } from "../store"

const DashboardQuery = graphql`
  query router_Dashboard_Query {
    viewer { ...dashboard_viewer }
  }
`

export default createBrowserRouter({
  routeConfig: makeRouteConfig(
    <Route
      Component={ Dashboard }
      path="/"
      query={ DashboardQuery }
    >
      <Route Component={ Index } />
    </Route>
  )
})

// import { application, node, viewer } from "../utils/queries"

// import Documentation from "routes/documentation"

//
//
// import Signup from "routes/signup"
// import Test from "routes/test"

// import boardRouter from "./boards"
// import daemonRouter from "./daemons"
// import gameRouter from "./games"
// import snakeRouter from "./snakes"

// import { renderLoading } from "./utils"

// const history = syncHistoryWithStore(browserHistory, store)

// export class Router extends React.Component<any, any> {
//   render() {
//     return (
//       <ReactRouter
//         history={ history }
//         render={ applyRouterMiddleware(useRelay) }
//         environment={ Relay.Store }
//       >

//         <Route
//           path="/"
//           component={ Dashboard }
//           queries={ { viewer } }
//           render={ renderLoading(Dashboard) }
//         >
//           <IndexRoute component={ Index } />

//           { boardRouter() }
//           { daemonRouter() }
//           { gameRouter() }
//           { snakeRouter() }

//           <Route path="documentation" component={ Documentation } queries={ { viewer } } />
//           <Route path="signup" component={ Signup } />
//           <Route path="test" component={ Test } queries={ { application } } />
//         </Route>
//       </ReactRouter>
//     )
//   }
// }
