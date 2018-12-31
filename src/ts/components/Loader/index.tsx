import "./index.scss"

import classnames from "classnames"
import { chunk, range } from "lodash"
import React from "react"

interface LoaderProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
  sideLength?: number
  speed?: number
}

interface LoaderState {
  tickCount: number
}

export const LOADER_SPEED_SLOW = 100
export const LOADER_SPEED_FAST = 50

class Loader extends React.Component<LoaderProps, LoaderState> {
  static defaultProps = { sideLength: 4, speed: LOADER_SPEED_SLOW }
  state: LoaderState = { tickCount: 0 }

  timer?: number

  componentDidMount () {
    const { speed } = this.props

    this.timer = window.setTimeout(this.tick, speed)
  }

  componentWillUnmount () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  }

  tick = () => {
    const { speed } = this.props

    this.setState({ tickCount: ++this.state.tickCount }, () => {
      this.timer = window.setTimeout(this.tick, speed)
    })
  }

  activeForTickAndPosition (tick: number, rowNumber: number, cellNumber: number) {
    const { sideLength } = this.props

    if (tick < sideLength!) {
      return tick === cellNumber && rowNumber === 0
    } else if (tick >= sideLength! && tick < (2 * sideLength! - 2)) {
      return tick - (sideLength! - 1) === rowNumber && cellNumber === sideLength! - 1
    } else if (tick >= (2 * sideLength! - 2) && tick <= (3 * sideLength! - 3)) {
      return rowNumber === (sideLength! - 1) && (sideLength! - 1) - Math.abs((2 * sideLength! - 2) - tick) === cellNumber
    } else {
      return rowNumber === (sideLength! - 1) - Math.abs((3 * sideLength! - 3) - tick) && cellNumber === 0
    }
  }

  cellIsActive (rowNumber: number, cellNumber: number) {
    const { sideLength } = this.props
    const { tickCount } = this.state

    const perimeter = 2 * sideLength! + 2 * (sideLength! - 2)
    const modTick = tickCount % perimeter
    const prevTick = tickCount === 0 ? 0 : (tickCount - 1) % perimeter

    return this.activeForTickAndPosition(modTick, rowNumber, cellNumber)
      || this.activeForTickAndPosition(prevTick, rowNumber, cellNumber)
  }

  renderCell (rowNumber: number, cellNumber: number) {
    const className = classnames("Loader__cell", {
      "Loader__cell--active": this.cellIsActive(rowNumber, cellNumber)
    })

    return (
      <div className={ className } key={ cellNumber } />
    )
  }

  renderRow (row: number[], rowNumber: number) {
    return (
      <div className="Loader__row" key={ rowNumber }>
        { row.map((cell, cellNumber) => this.renderCell(rowNumber, cellNumber)) }
      </div>
    )
  }

  render () {
    const { className, sideLength = 3 } = this.props

    const mClassName = classnames("Loader", className)
    const chunks = chunk(range(0, sideLength ** 2), sideLength)

    return (
      <div className={ mClassName } onClick={ this.tick }>
        { chunks.map((chunk, rowNumber) => this.renderRow(chunk, rowNumber)) }
      </div>
    )
  }
}

export default Loader
