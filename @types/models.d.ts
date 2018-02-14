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

  export interface BoardInterface {
    id: string
    configuration: Configuration
    createdAt: number
    creator: UserInterface
    deletedAt: number
    name: string
    updatedAt: number
    visibility: VisibilityType
  }

  export interface DaemonInterface {
    id: string
    averageResponseTime: number
    description: string
    createdAt: number
    owner: UserInterface
    deletedAt: number
    name: string
    updatedAt: number
    url: string
    visibility: VisibilityType
  }

  export interface FileInterface {
    id: string
    bucket: string
    key: string
    name: string
    url: string
    published: boolean
  }

  export interface GameInterface {
    id: GraphQL.Schema.GraphQLID
    realId: string
    boardColumns: number
    boardConfiguration: BoardInterface
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
    creator: UserInterface
    completedAt: number
    daemon: DaemonInterface
    devMode: boolean
    deletedAt: number
    responseTime: number
    snakes: GraphQL.Schema.GraphConnection<SnakeInterface>
    status: string
    startedAt: number
    tickRate: number
    turnLimit: number
    updatedAt: number
    winner: SnakeInterface
    viewerCount: number
    visibility: VisibilityType

    getFoodStrategy: () => string
    getGoldStrategy: () => string
  }

  export type MedalTierType = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "ONYX"

  export interface MedalInterface {
    id: string
    name: string
    description: string
    tier: MedalTierType
    value: number
  }

  export interface SnakeInterface {
    id: string
    bountyDescription: string
    createdAt: number
    defaultColor: string
    deletedAt: number
    games: GraphQL.Schema.GraphConnection<GameInterface>
    head: FileInterface
    isBountySnake: boolean
    lastCheckedAt: number
    lastSuccessfullyCheckedAt: number
    apiVersion: "VERSION_2017" | "VERSION_2018"
    name: string
    owner: UserInterface
    updatedAt: number
    url: string
  }

  export interface UserInterface {
    id: string
    username: string
    password: string
    createdAt: string
    deletedAt: string
    games: GameInterface[]
    snakes: SnakeInterface[]
    medals: MedalInterface[]
  }
}