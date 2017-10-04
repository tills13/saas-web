export const CELL_TYPE_FOOD = "CELL_TYPE_FOOD"
export const CELL_TYPE_GOLD = "CELL_TYPE_GOLD"
export const CELL_TYPE_SNAKE = "CELL_TYPE_SNAKE"
export const CELL_TYPE_TELEPORTER = "CELL_TYPE_TELEPORTER"
export const CELL_TYPE_WALL = "CELL_TYPE_WALL"

export type PlacementType =
  typeof CELL_TYPE_FOOD |
  typeof CELL_TYPE_GOLD |
  typeof CELL_TYPE_SNAKE |
  typeof CELL_TYPE_TELEPORTER |
  typeof CELL_TYPE_WALL
