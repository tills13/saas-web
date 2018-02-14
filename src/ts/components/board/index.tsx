import "./index.scss"

import * as classNames from "classnames"
import * as React from "react"

import { partial, forEach } from "lodash"
import { compose, mapProps } from "recompose"

import Icon from "components/icon"

import { BoardRenderer } from "./renderer"

export const CELL_TYPE_FOOD = "CELL_TYPE_FOOD"
export const CELL_TYPE_GOLD = "CELL_TYPE_GOLD"
export const CELL_TYPE_SNAKE = "CELL_TYPE_SNAKE"
export const CELL_TYPE_TELEPORTER = "CELL_TYPE_TELEPORTER"
export const CELL_TYPE_WALL = "CELL_TYPE_WALL"

interface BoardComponentOwnProps {
  boardColumns?: number
  boardRows?: number
  className?: string
  configuration?: Models.BoardInterface

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

const RENDER_METHOD_CANVAS = "RENDER_METHOD_CANVAS"
const RENDER_METHOD_DOM = "RENDER_METHOD_DOM"

class Board extends React.Component<BoardComponentOwnProps, {}> {
  static defaultProps = { updateOnPropsChanged: false }

  boardRef: HTMLDivElement
  boardRenderer: BoardRenderer
  container: HTMLDivElement
  layers: { bg?: HTMLCanvasElement, fg?: HTMLCanvasElement } = {}
  layerContexts: { bg?: CanvasRenderingContext2D, fg?: CanvasRenderingContext2D } = {}

  renderMethod: typeof RENDER_METHOD_CANVAS | typeof RENDER_METHOD_DOM
  timer: number

  constructor (props: BoardComponentOwnProps) {
    super(props)

    const { boardColumns, boardRows } = this.props

    this.renderMethod = RENDER_METHOD_CANVAS
    this.boardRenderer = new BoardRenderer({
      height: boardRows,
      width: boardColumns
    })
  }

  componentDidMount () {
    (window as any)._oldresize = window.onresize
    window.onresize = this.onResize

    if (this.renderMethod === RENDER_METHOD_CANVAS) {
      this.onResize()

      if (!this.props.updateOnPropsChanged) {
        this.timer = setTimeout(this.drawBoard, 100)
      }
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const { fg, bg } = this.layerContexts

    this.boardRenderer.render(
      [fg, bg],
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

    this.boardRenderer.render(
      [fg, bg],
      this.props
    )

    this.timer = setTimeout(this.drawBoard, 100)
  }

  getColoredCells () {
    const { food = [], gold = [], snakes = [], teleporters = [], walls = [] } = this.props

    const coloredCells: { [position: string]: string } = {}

    snakes.forEach((snake) => {
      snake.coords.forEach((coord) => {
        coloredCells[`${ coord.x }-${ coord.y }`] = coord.color || snake.color || "blue"
      })
    })

    food.forEach((foodCoord) => {
      coloredCells[`${ foodCoord.x }-${ foodCoord.y }`] = foodCoord.color || "green"
    })

    gold.forEach((coord) => {
      coloredCells[`${ coord.x }-${ coord.y }`] = coord.color || "yellow"
    })

    teleporters.forEach((coord) => {
      coloredCells[`${ coord.x }-${ coord.y }`] = coord.color || "orange"
    })

    walls.forEach((coord) => {
      coloredCells[`${ coord.x }-${ coord.y }`] = coord.color || "black"
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

    forEach(this.layers, layer => {
      layer.height = parentHeight
      layer.width = width
    })

    const { bg, fg } = this.layerContexts
    this.boardRenderer.render([fg, bg], this.props, true)
  }

  renderBoard () {
    if (this.renderMethod === RENDER_METHOD_DOM) {
      return this.renderBoardDom()
    }

    return this.renderBoardCanvas()
  }

  renderBoardCanvas () {
    return [
      <canvas
        key="foreground"
        ref={ (canvas) => {
          this.layers.fg = canvas
          if (canvas) this.layerContexts.fg = canvas.getContext("2d")
        } }
      />,
      <canvas
        key="background"
        ref={ (canvas) => {
          this.layers.bg = canvas
          if (canvas) this.layerContexts.bg = canvas.getContext("2d")
        } }
      />
    ]
  }

  renderBoardDom () {
    const { boardColumns, boardRows, onClickCell } = this.props
    console.log(this.props)

    const rows = []
    const coloredCells = this.getColoredCells()

    const cellClass = classNames("Board__cell", {
      "Board__cell--clickable": !!onClickCell
    })

    for (let y = 0; y < boardRows; y++) {
      const row = []

      for (let x = 0; x < boardColumns; x++) {
        const style = {
          background: coloredCells[`${ x }-${ y }`],
          backgroundColor: coloredCells[`${ x }-${ y }`]
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
    const boardClassName = classNames("Board", {
      "Board--isPreview": this.props.isPreview
    })

    return (
      <div
        className={ boardClassName }
        ref={ elem => this.container = elem }
      >
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
