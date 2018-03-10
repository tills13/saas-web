declare namespace GraphQL.Schema {
  type GraphNode<T> = T
  type GraphEdge<T, E = {}> = { node: GraphNode<T> } & E
  type GraphConnection<T, E = {}> = { count: number, edges: GraphEdge<T, E>[] }
  type GraphQLList<T> = T[]
  type GraphQLPaginatedListPageInfo = { count: number }
  type GraphQLPaginatedList<T> = { items: T[], pageInfo: GraphQLPaginatedListPageInfo }


  type GraphQLID = string

  export interface Application {
    id: GraphQLID
    boards?: GraphQLPaginatedList<Models.Board>
    daemons?: GraphQLPaginatedList<Models.Daemon>
    games?: GraphQLPaginatedList<Models.Game>
    snakes?: GraphQLPaginatedList<Models.Snake>
  }

  export interface Viewer {
    id: GraphQLID
    username: string

    daemons?: GraphConnection<Models.Daemon>
    games?: GraphConnection<Models.Game>
    medals?: GraphConnection<Models.Medal>
    snakes?: GraphConnection<Models.Snake>
  }

  export type Node<T> = T
}