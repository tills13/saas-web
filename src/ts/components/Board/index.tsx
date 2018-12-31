import "./index.scss"

import classnames from "classnames"
import { forEach, partial } from "lodash"
import React from "react"

import { BoardRendererOptions } from "./renderer"
import BoardRenderer from "./renderer"

export enum CellType { Food, Gold, Snake, Teleporter, Wall }

export type BoardOptions = {
  /* in seconds */
  deathTimeout?: number
}

export const defaultOptions = {
  deathTimeout: 30
}

interface BoardProps {
  autoStart?: boolean
  className?: string
  configuration?: Models.Board
  fillWidth?: boolean
  food?: GameAPI.Food[]
  gold?: GameAPI.Gold[]
  height: number
  isPreview?: boolean
  onClickCell?: (x: number, y: number) => void
  onHoverCell?: (x: number, y: number) => void
  renderer?: BoardRenderer
  snakes?: GameAPI.Snake[]
  teleporters?: GameAPI.Teleporter[]
  turnNumber?: number
  walls?: GameAPI.Wall[]
  width: number
}

class Board extends React.Component<BoardProps, {}> {
  static defaultProps = {
    fillWidth: false,
    renderBackground: true,
    updateOnPropsChanged: false
  }

  private renderer?: BoardRenderer

  private bgCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
  private containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  private fgCanvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  constructor (props: BoardProps) {
    super(props)

    if (props.renderer) {
      this.renderer = props.renderer
    }
  }

  componentDidMount () {
    const { height, width } = this.props

    if (this.renderer) {
      this.renderer.setDimensions(height, width)
      this.renderer.setCanvases(this.fgCanvasRef.current!, this.bgCanvasRef.current!, true)
      this.renderer.updateState(this.props)

      window.onresize = this.onResize
      this.onResize()

      if (this.props.autoStart) {
        this.renderer.start()
      }
    }
  }

  componentDidUpdate () {
    const { height, width } = this.props

    if (this.renderer) {
      this.renderer.setDimensions(height, width)
      this.renderer.updateState(this.props)
      this.onResize()
    }
  }

  getColoredCells () {
    const { food = [], gold = [], snakes = [], teleporters = [], walls = [] } = this.props

    const coloredCells: { [ position: string ]: string } = {}

    snakes.forEach((snake) => {
      snake.coords.forEach((coord) => {
        coloredCells[ `${ coord.x }-${ coord.y }` ] = coord.color || snake.color || "blue"
      })
    })

    food.forEach((foodCoord) => {
      coloredCells[ `${ foodCoord.x }-${ foodCoord.y }` ] = foodCoord.color || "green"
    })

    gold.forEach((coord) => {
      coloredCells[ `${ coord.x }-${ coord.y }` ] = coord.color || "yellow"
    })

    teleporters.forEach((coord) => {
      coloredCells[ `${ coord.x }-${ coord.y }` ] = coord.color || "orange"
    })

    walls.forEach((coord) => {
      coloredCells[ `${ coord.x }-${ coord.y }` ] = coord.color || "black"
    })

    return coloredCells
  }

  onClickCell = (x: number, y: number, event: React.MouseEvent<any>) => {
    const { onClickCell } = this.props

    if (onClickCell) onClickCell(x, y)
  }

  onResize = () => {
    const { fillWidth } = this.props
    const container = this.containerRef.current!

    const width = container.clientWidth
    const height = container.clientHeight

    const parent = container.parentElement
    const parentHeight = parent ? parent.clientHeight : Infinity

    if (container.clientHeight === 0) {
      container.style.height = `${ Math.max(parentHeight, document.body.clientHeight) }px`
    }

    const ratio = this.props.width / this.props.height
    const dimension = fillWidth
      ? width
      : Math.min(Math.max(width, height), Math.max(parentHeight, document.body.clientHeight))

    forEach([ this.bgCanvasRef, this.fgCanvasRef ], layer => {
      const mLayer = layer.current!

      mLayer.height = (height > width) ? dimension : dimension / ratio
      mLayer.width = (width > height) ? dimension : dimension * ratio
    })
  }

  renderBoard () {
    return this.renderer
      ? this.renderBoardCanvas()
      : this.renderBoardDom()
  }

  renderBoardCanvas () {
    return (
      <div className="Board__container">
        <canvas ref={ this.fgCanvasRef } />
        <canvas ref={ this.bgCanvasRef } />
      </div>
    )
  }

  renderBoardDom () {
    const { width, height, onClickCell } = this.props

    const rows = []
    const coloredCells = this.getColoredCells()

    const cellClass = classnames("Board__cell", { "--clickable": !!onClickCell })

    for (let y = 0; y < height; y++) {
      const row = []

      for (let x = 0; x < width; x++) {
        const style = {
          background: coloredCells[ `${ x }-${ y }` ],
          backgroundColor: coloredCells[ `${ x }-${ y }` ]
        }

        row.push(
          <div
            key={ `${ x }-${ y }` }
            className={ cellClass }
            data-x={ x }
            data-y={ y }
            onClick={ partial(this.onClickCell, x, y) }
            style={ style }
          />
        )
      }

      rows.push(<div className="Board__row" data-row={ y } key={ y }>{ row }</div>)
    }

    return rows
  }

  render () {
    const boardClassName = classnames(
      "Board",
      this.renderer ? "--canvas" : "--dom",
      { "--preview": this.props.isPreview }
    )

    return (
      <div className={ boardClassName } ref={ this.containerRef }>
        { this.renderBoard() }
      </div>
    )
  }
}

export default Board
