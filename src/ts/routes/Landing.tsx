import "./Landing.scss"

import React from "react"

import Board from "components/Board"
import LinkButton from "components/button/link_button"

import { Direction } from "enums/Direction"
import * as gUtils from "utils/game"

type Snake = Pick<GameAPI.Snake, "color" | "coords" | "health" | "death"> & { direction: Direction }

const deathTimeout = 10

interface LandingState {
  snakes: Snake[]
  tick: number
}

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

function filterDeadAndGone (turn: number, snake: Snake) {
  if (!snake.death) return true
  return (turn - snake.death.turn) < deathTimeout
}

function moveSnake (snake: Snake) {
  if (snake.death) return snake

  const mSnake = { ...snake }
  const coords = mSnake.coords
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

class Landing extends React.Component<{}, LandingState> {
  state: LandingState = { snakes: [], tick: 0 }

  height = 20
  width = 30
  timeout: any

  renderer: BoardRenderer

  componentDidMount () {
    this.tickBoard()
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  tickBoard = () => {
    const { snakes, tick } = this.state
    // console.log(JSON.stringify(snakes))

    this.setState(({ tick }) => ({ tick: tick + 1 }))

    let mSnakes = snakes.map(moveSnake)
    mSnakes = mSnakes.filter(filterOffBoard.bind(null, this.width, this.height))
    mSnakes = mSnakes.filter(filterDeadAndGone.bind(null, tick))
    mSnakes = resolveAlive(mSnakes, tick)

    if (mSnakes.length < 10 && Math.random() > 0.20) {
      const newSnake = gUtils.generateRandomSnake(this.width, this.height)

      return this.setState(
        { snakes: [ ...mSnakes, newSnake ] },
        () => this.timeout = setTimeout(this.tickBoard, 100)
      )
    }

    this.setState({ snakes: mSnakes })
    this.timeout = setTimeout(this.tickBoard, 100)
  }

  render () {
    const { snakes, tick } = this.state

    return (
      <div className="Index">
        <div className="Index__cta">
          <h2>Snake as a Service</h2>
          <LinkButton to="/documentation" block>Get Started</LinkButton>
        </div>

        <Board
          height={ this.height }
          width={ this.width }
          renderBackground={ true }
          rendererOptions={ { deathTimeout } }
          snakes={ [ ...snakes ] as any[] }
          turnNumber={ tick }
          fillWidth
        />
      </div>
    )
  }
}

export default Landing
