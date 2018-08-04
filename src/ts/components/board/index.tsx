import "./index.scss"

import classnames from "classnames"
import React from "react"

import { forEach, partial } from "lodash"
import { compose, mapProps } from "recompose"

import { BoardRenderer as Renderer } from "./renderer"

export enum BoardRenderer { Canvas, Dom }
export enum CellType { Food, Gold, Snake, Teleporter, Wall }

interface BoardComponentOwnProps {
  boardColumns?: number
  boardRows?: number
  className?: string
  configuration?: Models.Board
  renderer?: BoardRenderer

  food?: GameAPI.Food[]
  gold?: GameAPI.Gold[]
  snakes?: GameAPI.Snake[]
  teleporters?: GameAPI.Teleporter[]
  turnNumber?: number
  walls?: GameAPI.Wall[]

  overlayContents?: JSX.Element | React.ReactElement<any> | HTMLElement
  onClickCell?: (x: number, y: number) => void
  onClickCloseOverlay?: () => void
  onHoverCell?: (x: number, y: number) => void

  isPreview?: boolean
  updateOnPropsChanged?: boolean
}

class Board extends React.Component<BoardComponentOwnProps, {}> {
  static defaultProps = { renderer: BoardRenderer.Canvas, updateOnPropsChanged: false }

  boardRef: HTMLDivElement
  renderer: Renderer
  container: HTMLDivElement
  layers: { bg?: HTMLCanvasElement, fg?: HTMLCanvasElement } = {}
  layerContexts: { bg?: CanvasRenderingContext2D, fg?: CanvasRenderingContext2D } = {}

  timer: any

  constructor (props: BoardComponentOwnProps) {
    super(props)

    if (props.renderer === BoardRenderer.Canvas) {
      this.renderer = new Renderer({
        height: props.boardRows,
        width: props.boardColumns
      })
    }
  }

  componentDidMount () {
    const { renderer } = this.props
    window.onresize = this.onResize

    if (renderer === BoardRenderer.Canvas) {
      this.onResize()

      if (!this.props.updateOnPropsChanged) {
        this.timer = setTimeout(this.drawBoard, 100)
      }
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const { fg, bg } = this.layerContexts

    this.renderer.render(
      [ fg, bg ],
      nextProps
    )
  }

  componentWillUnmount () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  }

  drawBoard = () => {
    const { fg, bg } = this.layerContexts

    this.renderer.render(
      [ fg, bg ],
      this.props
    )

    this.timer = setTimeout(this.drawBoard, 100)
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
      this.container.style.height = `${ Math.max(parentHeight, document.body.clientHeight) }`
    }

    const dimension = Math.min(Math.max(width, height), Math.max(parentHeight, document.body.clientHeight))

    forEach(this.layers, layer => {
      layer.height = dimension
      layer.width = dimension
    })

    const { bg, fg } = this.layerContexts
    this.renderer.render([ fg, bg ], this.props, true)
  }

  renderBoard () {
    return this.props.renderer === BoardRenderer.Dom
      ? this.renderBoardDom()
      : this.renderBoardCanvas()
  }

  renderBoardCanvas () {
    return (
      <React.Fragment>
        <canvas
          ref={ (canvas) => {
            this.layers.fg = canvas
            if (canvas) this.layerContexts.fg = canvas.getContext("2d")
          } }
        />
        <canvas
          ref={ (canvas) => {
            this.layers.bg = canvas
            if (canvas) this.layerContexts.bg = canvas.getContext("2d")
          } }
        />
      </React.Fragment>
    )
  }

  renderBoardDom () {
    const { boardColumns, boardRows, onClickCell } = this.props

    const rows = []
    const coloredCells = this.getColoredCells()

    const cellClass = classnames("Board__cell", { "--clickable": !!onClickCell })

    for (let y = 0; y < boardRows; y++) {
      const row = []

      for (let x = 0; x < boardColumns; x++) {
        const style = {
          background: coloredCells[ `${ x }-${ y }` ],
          backgroundColor: coloredCells[ `${ x }-${ y }` ]
        }

        row.push(
          <div
            className={ cellClass }
            key={ `${ x }-${ y }` }
            style={ style }
            data-x={ x }
            data-y={ y }
            onClick={ partial(this.onClickCell, x, y) }
          />
        )
      }

      rows.push(<div className="Board__row" data-row={ y } key={ y }>{ row }</div>)
    }

    return rows
  }

  render () {
    const boardClassName = classnames("Board", { "--preview": this.props.isPreview })

    return (
      <div className={ boardClassName } ref={ e => this.container = e }>
        { this.renderBoard() }
      </div>
    )
  }
}

export default compose<any, BoardComponentOwnProps>(
  mapProps(({ configuration, ...rest }: BoardComponentOwnProps) => {
    return {
      ...(configuration ? configuration.configuration : {}),
      ...rest
    }
  })
)(Board)
