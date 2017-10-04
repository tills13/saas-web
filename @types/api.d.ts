declare namespace GameAPI {
  interface Position {
    x: number
    y: number
  }

  interface Colorable {
    color?: string
    defaultColor?: string
  }

  interface Snake extends Colorable {
    coords: (Position & Colorable)[]
    goldCount: number
    head: { url: string }
    health: number
    id: string
    name: string
    taunt: string
    score: number
  }

  interface Food extends Position, Colorable { }
  interface Gold extends Position, Colorable { }
  interface Teleporter extends Position, Colorable {
    channel: number
  }

  interface Wall extends Position, Colorable { }

  interface Daemon {
    id: string
    name: string
    message: string
  }
}
