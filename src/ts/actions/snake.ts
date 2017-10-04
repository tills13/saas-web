import * as _ from "lodash"

import { Map } from "immutable"
import { Dispatch } from "react-redux"
import { http } from "../utils/fetch"

export const GET_SNAKES = "GET_SNAKES"
export const GET_TOP_SNAKES = "GET_TOP_SNAKES"
export const GET_SNAKE_GAMES = "GET_SNAKE_GAMES"
export const SNAKE_CREATED = "SNAKE_CREATED"
export const SNAKE_UPDATED = "SNAKE_UPDATED"
export const TEST_SNAKE_ENDPOINT = "TEST_SNAKE_ENDPOINT"

export function testSnakeEndpoint(snake: Models.SnakeInterface) {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return http.get(`/snakes/${ snake.id }/test`)
  }
}
