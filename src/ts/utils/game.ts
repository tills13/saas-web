import { Direction } from "enums/Direction"

export const colors = [ "#114B5F", "#32D194", "#5bc0de", "#FFE066", "#F25F5C" ]

type SimpleSnake = { coords: GameAPI.BoardPosition[], color: string, direction: Direction, health: number }
export function generateRandomSnake (
  width: number,
  height: number
): SimpleSnake {
  const color = colors[ Math.floor(Math.random() * colors.length) ]
  const direction = Math.random() > 0.5 ? Direction.Left : Direction.Right
  const initialPosition: GameAPI.BoardPosition = direction === Direction.Left
    ? { x: width, y: Math.floor(Math.random() * height), color: "blue" }
    : { x: 0, y: Math.floor(Math.random() * height), color: "blue" }

  const coords = [ initialPosition ]

  for (let i = 1; i <= Math.max(5, Math.random() * 30); i++) {
    coords.push(move(initialPosition, opposite(direction), i))
  }

  return { id: Math.round(Math.random() * 1000), coords, color, direction, health: 100 }
}

export function kill (snake: Pick<GameAPI.Snake, "health" | "death">, turn?: number): void {
  snake.health = 0
  snake.death = { turn }
}

export function move (position: GameAPI.Position, direction: Direction, distance: number = 1): GameAPI.Position {
  switch (direction) {
    case Direction.Left: return { ...position, x: position.x - distance }
    case Direction.Up: return { ...position, y: position.y + distance }
    case Direction.Right: return { ...position, x: position.x + distance }
    case Direction.Down: return { ...position, y: position.y - distance }
  }
}

export function opposite (direction: Direction): Direction {
  switch (direction) {
    case Direction.Left: return Direction.Right
    case Direction.Up: return Direction.Down
    case Direction.Right: return Direction.Left
    case Direction.Down: return Direction.Up
  }
}

export function same (p1: GameAPI.Position, p2: GameAPI.Position): boolean {
  return p1.x === p2.x && p1.y === p2.y
}

