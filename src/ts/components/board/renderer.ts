import { pick } from "lodash"

import { DIRECTION, getMovementDirection } from "./coordinate"
import { getSnakeHead, makeContext, withinContext } from "./utils"

import bendr from "../../../static/image/snake/head/bendr.svg"
import dead from "../../../static/image/snake/head/dead.svg"
import fang from "../../../static/image/snake/head/fang.svg"
import pixel from "../../../static/image/snake/head/pixel.svg"
import regular from "../../../static/image/snake/head/regular.svg"
import safe from "../../../static/image/snake/head/safe.svg"
import sand from "../../../static/image/snake/head/sand-worm.svg"
import shades from "../../../static/image/snake/head/shades.svg"
import smile from "../../../static/image/snake/head/smile.svg"
import tongue from "../../../static/image/snake/head/tongue.svg"
import { CreateBoardQueryResponse } from "../../../__artifacts__/CreateBoardQuery.graphql";

const heads = { bendr, dead, fang, pixel, regular, safe, sand, shades, smile, tongue }

type Context = CanvasRenderingContext2D

export type BoardRendererOptions = {
  colorPalette: { [ name: string ]: string }
  deathTimeout: number
  dimensions: { width: number, height: number }
  renderBackground: boolean
}

export type BoardState = {
  food: GameAPI.Food[]
  gold: GameAPI.Gold[]
  snakes: GameAPI.Snake[]
  teleporters: GameAPI.Teleporter[]
  turnNumber: number
  walls: GameAPI.Wall[]
}

const DEFAULT_PALETTE = {
  food: "#32D194",
  gold: "#F8F08D",
  teleporter: "#5BC0DE",
  tile: "#114B5F"
}

const defaultOpts: Partial<BoardRendererOptions> = {
  colorPalette: {},
  deathTimeout: 30,
  renderBackground: true
}

export class BoardRenderer {
  private bgContext: CanvasRenderingContext2D
  private fgContext: CanvasRenderingContext2D

  private margin: number = 0.05
  private padding: number = 0
  private unit: number = 1 - 2 * this.margin
  private halfUnit = this.unit / 2
  private offset: number = this.unit / 2 * -1

  private redrawBackground: boolean = true

  private boardState: Partial<BoardState>
  private animationFrame: number

  private opts: BoardRendererOptions

  constructor (
    private bgCanvas: HTMLCanvasElement,
    private fgCanvas: HTMLCanvasElement,
    initialOpts: BoardRendererOptions
  ) {
    this.opts = Object.assign(defaultOpts, initialOpts)
    this.initializeCanvases()
  }

  initializeCanvases () {
    this.bgContext = this.bgCanvas.getContext("2d")
    this.fgContext = this.fgCanvas.getContext("2d")

    this.bgCanvas.style.zIndex = "0"
    this.fgCanvas.style.zIndex = "1"
  }

  clearLayer = (context: Context) => {
    const { height, width } = context.canvas
    context.clearRect(0, 0, width, height)
  }

  normalizeLayer = (context: Context) => {
    this.scaleLayer(context)
    context.translate(0.5, 0.5)
  }

  scaleLayer = (context: Context) => {
    const clientWidth = context.canvas.width
    const clientHeight = context.canvas.height
    const width = this.opts.dimensions.width + this.padding * 2
    const height = this.opts.dimensions.height + this.padding * 2

    const h = clientHeight / height
    const w = clientWidth / width
    const sign = clientWidth / clientHeight > width / height
    const scaler = sign ? h : w

    const xT = sign ? (clientWidth - h * width) / 2 : 0
    const yT = sign ? 0 : (clientHeight - w * height) / 2

    context.translate(xT, yT)
    context.scale(scaler, scaler)
    context.translate(this.padding / 2, this.padding / 2)
  }

  updateState (newOptions: Partial<BoardRendererOptions>, boardState: Partial<BoardState>) {
    this.opts = Object.assign(this.opts, newOptions)
    this.boardState = Object.assign(
      { food: [], gold: [], snakes: [], walls: [] },
      pick(boardState, [ "food", "gold", "snakes", "turnNumber", "walls" ])
    )
  }

  start (redrawBackground: boolean = true) {
    this.redrawBackground = redrawBackground
    this.renderLoop()
  }

  stop () {
    cancelAnimationFrame(this.animationFrame)
  }

  drawGrid = (context: Context) => {
    if (!this.redrawBackground) return

    this.clearLayer(context)

    context.fillStyle = this.opts.colorPalette[ "tile" ] || DEFAULT_PALETTE.tile

    for (let x = 0; x < this.opts.dimensions.width; x++) {
      for (let y = 0; y < this.opts.dimensions.height; y++) {
        context.fillRect(x + this.margin, y + this.margin, this.unit, this.unit)
      }
    }

    context.scale(2, 2)
    this.redrawBackground = false
  }

  drawImage = (context: Context, image: HTMLImageElement, x: number, y: number, width: number, height: number, beforeDraw: (context: Context) => void) => {
    withinContext(context, (mContext) => {
      // mContext.translate(x + 0.5, y + 0.5)
      mContext.translate(x, y)
      beforeDraw && beforeDraw(mContext)
      mContext.drawImage(image, this.offset, this.offset, width, height)
    })
  }

  drawItem = (context: Context, type: "food" | "gold" | "teleporter" | "wall", thing: GameAPI.Cell) => {
    context.fillStyle = this.opts.colorPalette[ type ] || "black"

    context.beginPath()
    context.arc(thing.x, thing.y, this.halfUnit, 0, 2 * Math.PI)
    context.fill()
  }

  drawSnake = (context: Context, snake: GameAPI.Snake) => {
    const { turnNumber } = this.boardState
    const { death, coords } = snake

    if (snake.health <= 0 && death) {
      const turnsSinceDeath = Math.max(1, Math.min(this.opts.deathTimeout, turnNumber - death.turn))

      if ((context as any).filter) {
        const opacity = (1 - (turnsSinceDeath / this.opts.deathTimeout)) * 100;
        (context as any).filter = `opacity(${ opacity }%)`
      }
    }

    if (coords.length === 0) {
      return
    }

    // context.translate(0.5, 0.5)
    context.strokeStyle = snake.color || "black"
    context.lineWidth = this.unit
    context.lineJoin = "round"

    context.beginPath()
    context.moveTo(coords[ 0 ].x, coords[ 0 ].y)

    coords.forEach(coord => context.lineTo(coord.x, coord.y))

    context.stroke()

    // return this.drawSnakeHead(context, snake)
  }

  drawSnakeHead = async (context: Context, snake: GameAPI.Snake) => {
    // const headImage = svgToImage(<SVGSVGElement> heads[ "bendr" ], snake.color)

    const headLoc = snake.coords[ 0 ]
    const direction = getMovementDirection(snake)

    // return this.drawImage(context, headImage, headLoc.x, headLoc.y, this.unit, this.unit, (mContext) => {
    //   if (direction === DIRECTION.UP) mContext.rotate(Math.PI / 2)
    //   else if (direction === DIRECTION.LEFT) mContext.scale(-1, 1)
    //   else if (direction === DIRECTION.DOWN) mContext.rotate(-Math.PI / 2)
    // })
  }

  renderLoop = () => {
    this.render()
    this.animationFrame = requestAnimationFrame(this.renderLoop)
  }

  render = () => {
    if (!this.boardState) return

    if (this.opts.renderBackground) {
      withinContext(this.bgContext, this.drawGrid, this.scaleLayer)
    }

    this.clearLayer(this.fgContext)

    const { food, gold, snakes, walls } = this.boardState

    food.forEach(makeContext(this.fgContext, this.drawItem, this.normalizeLayer, "food"))
    gold.forEach(makeContext(this.fgContext, this.drawItem, this.normalizeLayer, "gold"))
    walls.forEach(makeContext(this.fgContext, this.drawItem, this.normalizeLayer, "wall"))

    snakes.forEach(makeContext(this.fgContext, this.drawSnake, this.normalizeLayer))

    // this.bgContext.scale(3, 3)
  }
}
