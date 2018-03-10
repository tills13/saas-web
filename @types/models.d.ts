declare namespace Models {
  export type Configuration = {
    boardColumns?: number
    boardRows?: number
    // food: List<GameAPI.Food>
    // gold: List<GameAPI.Gold>
    // snakes: List<GameAPI.Snake>
    // teleporters: List<GameAPI.Teleporter>
    // walls: List<GameAPI.Wall>
  }

  export type VisibilityType = "PUBLIC" | "PRIVATE"

  export interface Board {
    id: string
    configuration: Configuration
    createdAt: number
    creator: User
    deletedAt: number
    name: string
    updatedAt: number
    visibility: VisibilityType
  }

  export interface Daemon {
    id: string
    averageResponseTime: number
    description: string
    createdAt: number
    owner: User
    deletedAt: number
    name: string
    updatedAt: number
    url: string
    visibility: VisibilityType
  }

  export interface File {
    id: string
    bucket: string
    key: string
    name: string
    url: string
    published: boolean
  }

  export interface Game {
    id: GraphQL.Schema.GraphQLID
    realId: string
    boardColumns: number
    boardConfiguration: Board
    boardConfigurationId: string
    boardFoodCount: number
    boardFoodStrategy: number
    boardGoldCount: number
    boardGoldStrategy: number
    boardGoldRespawnTimeout: number
    boardGoldWinningThreshold: number
    boardHasGold: boolean
    boardHasWalls: boolean
    boardHasTeleporters: boolean
    boardRows: number
    boardTeleporterCount: number
    createdAt: number
    creator: User
    completedAt: number
    daemon: Daemon
    devMode: boolean
    deletedAt: number
    gameType: GameTypeEnum
    pinTail: boolean
    responseTime: number
    snakes: GraphQL.Schema.GraphConnection<Snake>
    status: string
    startedAt: number
    tickRate: number
    turnLimit: number
    updatedAt: number
    winner: Snake
    viewerCount: number
    visibility: VisibilityType

    getFoodStrategy: () => string
    getGoldStrategy: () => string
  }

  export type GameTypeEnum = "TYPE_CUSTOM" | "TYPE_PLACEMENT" | "TYPE_SCORE"

  export type MedalTierType = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "ONYX"

  export interface Medal {
    id: string
    name: string
    description: string
    tier: MedalTierType
    value: number
  }

  export interface Snake {
    id: string
    bountyDescription: string
    createdAt: number
    defaultColor: string
    deletedAt: number
    games: GraphQL.Schema.GraphConnection<Game, { place: number }>
    head: File
    isBountySnake: boolean
    lastCheckedAt: number
    lastSuccessfullyCheckedAt: number
    apiVersion: "VERSION_2017" | "VERSION_2018"
    name: string
    owner: User
    updatedAt: number
    url: string
  }

  export interface User {
    id: string
    username: string
    password: string
    createdAt: string
    deletedAt: string
    games: Game[]
    snakes: Snake[]
    medals: Medal[]
  }
}