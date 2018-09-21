import "./index.scss"

import classnames from "classnames"
import React from "react"

import { forEach, partial } from "lodash"
import { compose, mapProps } from "recompose"

import { BoardRenderer as Renderer } from "./renderer"

export enum BoardRenderer { Canvas, Dom }
export enum CellType { Food, Gold, Snake, Teleporter, Wall }

interface BoardProps {
  width?: number
  height?: number
  className?: string
  configuration?: Models.Board
  renderer?: BoardRenderer

  food?: GameAPI.Food[]
  gold?: GameAPI.Gold[]
  snakes?: GameAPI.Snake[]
  teleporters?: GameAPI.Teleporter[]
  walls?: GameAPI.Wall[]

  overlayContents?: JSX.Element | React.ReactElement<any> | HTMLElement
  onClickCell?: (x: number, y: number) => void
  onClickCloseOverlay?: () => void
  onHoverCell?: (x: number, y: number) => void

  isPreview?: boolean
  updateOnPropsChanged?: boolean
}

class Board extends React.Component<BoardProps, {}> {
  static defaultProps = { renderer: BoardRenderer.Canvas, updateOnPropsChanged: false }

  boardRef: HTMLDivElement
  renderer: Renderer
  container: HTMLDivElement

  bgCanvasRef: HTMLCanvasElement
  fgCanvasRef: HTMLCanvasElement

  componentDidMount () {
    const { height, renderer, width } = this.props

    if (renderer === BoardRenderer.Canvas) {
      this.renderer = new Renderer({
        dimensions: { width, height },
        bgCanvas: this.bgCanvasRef,
        fgCanvas: this.fgCanvasRef
      })

      this.renderer.updateState(width, height, this.props)

      window.onresize = this.onResize
      this.onResize()
      this.renderer.start()
    }
  }

  componentDidUpdate (_: BoardProps) {
    const { height, renderer, width } = this.props

    if (renderer === BoardRenderer.Canvas) {
      this.onResize()
      this.renderer.updateState(width, height, this.props)
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
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    const parent = this.container.parentElement

    const parentHeight = parent ? parent.clientHeight : Infinity

    if (this.container.clientHeight === 0) {
      this.container.style.height = `${ Math.max(parentHeight, document.body.clientHeight) }px`
    }

    const ratio = this.props.width / this.props.height
    const dimension = Math.min(Math.max(width, height), Math.max(parentHeight, document.body.clientHeight))

    forEach([ this.bgCanvasRef, this.fgCanvasRef ], layer => {
      layer.height = (height > width) ? dimension : dimension / ratio
      layer.width = (width > height) ? dimension : dimension * ratio
    })
  }

  renderBoard () {
    return this.props.renderer === BoardRenderer.Dom
      ? this.renderBoardDom()
      : this.renderBoardCanvas()
  }

  renderBoardCanvas () {
    return (
      <div className="Board__container">
        <canvas ref={ e => this.fgCanvasRef = e } />
        <canvas ref={ e => this.bgCanvasRef = e } />
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
    const { renderer } = this.props
    const boardClassName = classnames(
      "Board",
      renderer === BoardRenderer.Dom ? "--dom" : "--canvas",
      { "--preview": this.props.isPreview }
    )

    return (
      <div className={ boardClassName } ref={ e => this.container = e }>
        { this.renderBoard() }
      </div>
    )
  }
}

export default Board
