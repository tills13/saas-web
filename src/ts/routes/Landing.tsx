import "./Landing.scss"

import React from "react"

import Board from "components/Board"
import LinkButton from "components/LinkButton"

import { Direction } from "enums/Direction"
import * as gUtils from "utils/game"
import BoardRenderer from "components/Board/renderer";

type Snake = Pick<GameAPI.Snake, "color" | "coords" | "health" | "death"> & { direction: Direction }

const DEATH_TIMEOUT = 10

function resolveAlive (snakes: Snake[], turn: number) {
  const mSnakes = [ ...snakes ]

  mSnakes.forEach(function (snake, i) {
    if (snake.death) return

    const head = snake.coords[ 0 ]

    mSnakes.forEach(function (mSnake, j) {
      if (i === j || mSnake.death) return

      const mHead = mSnake.coords[ 0 ]

      if (gUtils.same(head, mHead)) {
        if (snake.coords.length === mSnake.coords.length) gUtils.kill(snake, turn)
        else if (snake.coords.length > mSnake.coords.length) gUtils.kill(mSnake, turn)
        else gUtils.kill(snake, turn)

        return
      }

      mSnake.coords.forEach(pos => {
        if (gUtils.same(head, pos)) {
          gUtils.kill(snake, turn)
          return
        }
      })
    })
  })

  return mSnakes
}

function filterOffBoard (width: number, height: number, snake: Snake): boolean {
  for (let i = 0; i < snake.coords.length; i++) {
    const coord = snake.coords[ i ]
    if ((coord.x >= 0 && coord.x < width) && (coord.y >= 0 && coord.y < height)) {
      return true
    }
  }

  return false
}

function filterExpired (turn: number, snake: Snake) {
  if (!snake.death) return true
  return (turn - snake.death.turn) < DEATH_TIMEOUT
}

function moveSnake (snake: Snake) {
  if (snake.death) return snake

  const mSnake = { ...snake }
  const coords = [ ...mSnake.coords ]
  const currentHead = coords[ 0 ]

  coords.pop()
  coords.unshift(
    Math.random() > 0.8
      ? gUtils.move(currentHead, Math.random() > 0.5 ? Direction.Up : Direction.Down)
      : gUtils.move(currentHead, mSnake.direction)
  )

  mSnake[ "coords" ] = coords
  return mSnake
}

const LANDING_BOARD_HEIGHT: number = 20
const LANDING_BOARD_WIDTH: number = 30

class Landing extends React.Component {
  timeout: any

  renderer = new BoardRenderer({
    deathTimeout: DEATH_TIMEOUT,
    renderBackground: false
  })

  snakes: Snake[] = []
  tick: number = 0

  componentDidMount () {
    this.tickBoard()
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  tickBoard = () => {
    this.tick++

    let mSnakes = this.snakes.map(moveSnake)
    mSnakes = mSnakes.filter(filterOffBoard.bind(null, LANDING_BOARD_WIDTH, LANDING_BOARD_HEIGHT))
    mSnakes = mSnakes.filter(filterExpired.bind(null, this.tick))
    mSnakes = resolveAlive(mSnakes, this.tick)

    if (mSnakes.length < 10 && Math.random() > 0.20) {
      const newSnake = gUtils.generateRandomSnake(
        LANDING_BOARD_WIDTH,
        LANDING_BOARD_HEIGHT
      )

      mSnakes.push(newSnake)
    }

    this.snakes = mSnakes

    this.renderer
      .updateState({ snakes: this.snakes as any, turnNumber: this.tick })
      .tick().then(
        () => { this.timeout = setTimeout(this.tickBoard, 100) }
      )
    // .tick()
    // this.timeout = setTimeout(this.tickBoard, 100)

  }

  render () {
    return (
      <div className="Index">
        <div className="Index__cta">
          <h2>Snake as a Service</h2>
          <LinkButton to="/documentation" block>Get Started</LinkButton>
        </div>

        <Board
          height={ LANDING_BOARD_HEIGHT }
          width={ LANDING_BOARD_WIDTH }
          renderer={ this.renderer }
          fillWidth
        />
      </div>
    )
  }
}

export default Landing
