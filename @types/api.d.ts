declare namespace GameAPI {
  interface BoardState {
    food: Food[]
    gold: Gold[]
    snakes: Snake[]
    teleport: Teleporter[]
    walls: Wall[]
  }

  interface GameState {
    board: BoardState
    daemon: Daemon
    errors: { [ snakeId: string ]: string }
    turnNumber: number
    viewers: number
  }

  interface Position {
    x: number
    y: number
  }

  interface Colorable {
    color?: string
    defaultColor?: string
  }

  type BoardPosition = Position & Colorable
  type Food = BoardPosition
  type Gold = BoardPosition
  type Teleporter = BoardPosition & { channel: number }
  type Wall = BoardPosition

  interface Snake extends Colorable {
    coords: SnakeCoord[]
    death?: { turn: number, reason?: string, killer?: Snake[ "id" ] }
    error: string,
    goldCount: number
    head: { url: string }
    health: number
    id: string
    kills: number
    name: string
    taunt: string
    score: number
  }

  interface Daemon {
    id: string
    name: string
    message: string
  }

  type Cell = Food | Gold | Teleporter | Wall
}
