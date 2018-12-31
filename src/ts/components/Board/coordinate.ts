export type Coordinate = { x: number, y: number }

export function subtract (p1: Coordinate, p2: Coordinate) {
  return { x: p1.x - p2.x, y: p1.y - p2.y }
}

export function getMovementDirection (snake: GameAPI.Snake) {
  const [ head, next ] = snake.coords
  const d = subtract(head, next)

  switch (`${ d.x } ${ d.y }`) {
    case "0 -1": return "down"
    case "0 1": return "up"
    case "-1 0": return "left"
    case "1 0": return "right"
  }
}
