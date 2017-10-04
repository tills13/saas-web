declare namespace GraphQL.Schema {
  type GraphNode<T> = T
  type GraphEdge<T> = { node: GraphNode<T> }
  type GraphConnection<T> = { count: number, edges: GraphEdge<T>[] }
  type GraphQLList<T> = T[]
  type GraphQLPaginatedListPageInfo = { count: number }
  type GraphQLPaginatedList<T> = { items: T[], pageInfo: GraphQLPaginatedListPageInfo }


  type GraphQLID = string

  export interface Application {
    id: GraphQLID
    boards?: GraphQLPaginatedList<Models.BoardInterface>
    daemons?: GraphQLPaginatedList<Models.DaemonInterface>
    games?: GraphQLPaginatedList<Models.GameInterface>
    snakes?: GraphQLPaginatedList<Models.SnakeInterface>
  }

  export interface Viewer {
    id: GraphQLID
    username: string

    daemons?: GraphConnection<Models.DaemonInterface>
    games?: GraphConnection<Models.GameInterface>
    medals?: GraphConnection<Models.MedalInterface>
    snakes?: GraphConnection<Models.SnakeInterface>
  }

  export type Node<T> = T
}