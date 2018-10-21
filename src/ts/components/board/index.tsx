import "./index.scss"

import classnames from "classnames"
import { forEach, partial } from "lodash"
import React from "react"

import Renderer, { BoardRendererOptions } from "./renderer"
import BoardRenderer from "./renderer"

export enum CellType { Food, Gold, Snake, Teleporter, Wall }
export enum RenderMethod { Canvas, Dom }

export type BoardOptions = {
  /* in seconds */
  deathTimeout?: number
}

export const defaultOptions = {
  deathTimeout: 30
}

interface BoardProps {
  className?: string
  configuration?: Models.Board
  fillWidth?: boolean
  food?: GameAPI.Food[]
  gold?: GameAPI.Gold[]
  height: number
  isPreview?: boolean
  onClickCell?: (x: number, y: number) => void
  onHoverCell?: (x: number, y: number) => void
  renderBackground?: boolean
  renderer?: RenderMethod
  rendererOptions?: Partial<Exclude<BoardRendererOptions, "dimensions">>
  snakes?: GameAPI.Snake[]
  teleporters?: GameAPI.Teleporter[]
  turnNumber?: number
  updateOnPropsChanged?: boolean
  walls?: GameAPI.Wall[]
  width: number
}

class Board extends React.Component<BoardProps, {}> {
  static defaultProps = {
    fillWidth: false,
    renderer: RenderMethod.Canvas,
    renderBackground: true,
    updateOnPropsChanged: false
  }

  private renderer?: BoardRenderer = undefined

  private bgCanvasRef: React.RefObject<HTMLCanvasElement>
  private containerRef: React.RefObject<HTMLDivElement>
  private fgCanvasRef: React.RefObject<HTMLCanvasElement>

  constructor (props: BoardProps) {
    super(props)

    this.bgCanvasRef = React.createRef()
    this.containerRef = React.createRef()
    this.fgCanvasRef = React.createRef()
  }

  componentDidMount () {
    const { height, renderer, width, renderBackground, rendererOptions } = this.props

    if (renderer === RenderMethod.Canvas) {
      const dimensions = { width, height }
      const options: BoardRendererOptions = Object.assign(rendererOptions, { dimensions, renderBackground })

      this.renderer = new Renderer(this.bgCanvasRef.current!, this.fgCanvasRef.current!, options)
      this.renderer.updateState({}, this.props)

      window.onresize = this.onResize
      this.onResize()
      this.renderer.start()
    }
  }

  componentDidUpdate () {
    const { height, renderer, width } = this.props

    if (renderer === RenderMethod.Canvas && this.renderer) {
      this.onResize()
      this.renderer.updateState({ dimensions: { width, height } }, this.props)
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
    return this.props.renderer === RenderMethod.Dom
      ? this.renderBoardDom()
      : this.renderBoardCanvas()
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
    const { renderer } = this.props
    const boardClassName = classnames(
      "Board",
      renderer === RenderMethod.Dom ? "--dom" : "--canvas",
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
